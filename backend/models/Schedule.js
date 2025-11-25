import { executeQuery } from "../database/connectiondb.js";

class Schedule {
    // Días de la semana (números para JSON)
    static DAYS = {
        LUNES: 1,
        MARTES: 2,
        MIERCOLES: 3,
        JUEVES: 4,
        VIERNES: 5,
        SABADO: 6,
        DOMINGO: 7,
    };

    // Días de la semana (nombres para compatibilidad)
    static DAYS_NAMES = {
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sábado",
        7: "Domingo",
    };

    // Estados de horario
    static STATES = {
        ACTIVE: 1,
        INACTIVE: 0,
    };

    // Tipos de horario
    static TYPES = {
        SEMANAL: "semanal",
        ESPECIFICO: "especifico",
    };

    // Obtener horarios de un empleado
    static async getEmployeeSchedules(empleado_id) {
        try {
            const query = `
        SELECT 
          h.*,
          t.tienda_nombre,
          e.empleado_especialidad,
          u.usuario_nombre,
          u.usuario_apellido
        FROM horarios h
        LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
        LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
        LEFT JOIN tiendas t ON h.tienda_id = t.tienda_id
        WHERE h.empleado_id = ? AND h.horario_estado = 1
        ORDER BY 
          h.horario_tipo_semanal,
          h.horario_nombre,
          h.horario_inicio
      `;

            const result = await executeQuery(query, [empleado_id]);

            if (!result.success) {
                throw new Error(`Error al obtener horarios: ${result.error}`);
            }

            // Procesar los datos para parsear JSON
            const processedData = result.data.map((schedule) => ({
                ...schedule,
                dias_trabajo: schedule.dias_trabajo
                    ? JSON.parse(schedule.dias_trabajo)
                    : [],
                dias_descanso: schedule.dias_descanso
                    ? JSON.parse(schedule.dias_descanso)
                    : [],
            }));

            return processedData;
        } catch (error) {
            throw new Error(
                `Error al obtener horarios del empleado: ${error.message}`
            );
        }
    }

    // Obtener horarios de todos los empleados de una tienda
    static async getStoreSchedules(tienda_id) {
        try {
            const query = `
        SELECT 
          h.*,
          t.tienda_nombre,
          e.empleado_especialidad,
          u.usuario_nombre,
          u.usuario_apellido
        FROM horarios h
        LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
        LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
        LEFT JOIN tiendas t ON h.tienda_id = t.tienda_id
        WHERE h.tienda_id = ? AND h.horario_estado = 1
        ORDER BY 
          u.usuario_nombre,
          h.horario_tipo_semanal,
          h.horario_nombre,
          h.horario_inicio
      `;

            const result = await executeQuery(query, [tienda_id]);

            if (!result.success) {
                throw new Error(`Error al obtener horarios: ${result.error}`);
            }

            // Procesar los datos para parsear JSON
            const processedData = result.data.map((schedule) => ({
                ...schedule,
                dias_trabajo: schedule.dias_trabajo
                    ? JSON.parse(schedule.dias_trabajo)
                    : [],
                dias_descanso: schedule.dias_descanso
                    ? JSON.parse(schedule.dias_descanso)
                    : [],
            }));

            return processedData;
        } catch (error) {
            throw new Error(
                `Error al obtener horarios de la tienda: ${error.message}`
            );
        }
    }

    // Crear horario para empleado
    static async createSchedule(scheduleData) {
        const {
            empleado_id,
            tienda_id,
            horario_tipo_semanal = "semanal",
            dias_trabajo = [],
            dias_descanso = [],
            fecha_inicio,
            fecha_fin = null,
            horario_nombre,
            horario_inicio,
            horario_fin,
            horario_dia = null, // Para horarios específicos
            horario_tipo = "cita",
        } = scheduleData;

        // Validaciones básicas
        if (!empleado_id || !tienda_id || !horario_inicio || !horario_fin) {
            throw new Error(
                "Empleado, tienda, hora inicio y fin son obligatorios"
            );
        }

        // Validar que la hora de inicio es menor que la de fin
        if (horario_inicio >= horario_fin) {
            throw new Error(
                "La hora de inicio debe ser menor que la hora de fin"
            );
        }

        // Validaciones específicas por tipo
        if (horario_tipo_semanal === "semanal") {
            if (!dias_trabajo || dias_trabajo.length === 0) {
                throw new Error("Debe especificar al menos un día de trabajo");
            }
            if (!horario_nombre) {
                throw new Error(
                    "El nombre del horario es obligatorio para horarios semanales"
                );
            }
            if (!fecha_inicio) {
                throw new Error("La fecha de inicio es obligatoria");
            }
        } else if (horario_tipo_semanal === "especifico") {
            if (!horario_dia) {
                throw new Error(
                    "El día específico es obligatorio para horarios específicos"
                );
            }
            if (!fecha_inicio) {
                throw new Error("La fecha de inicio es obligatoria");
            }
        }

        // Verificar que el empleado existe
        const employeeQuery =
            "SELECT empleado_id FROM empleados WHERE empleado_id = ?";
        const employeeResult = await executeQuery(employeeQuery, [empleado_id]);

        if (!employeeResult.success || employeeResult.data.length === 0) {
            throw new Error("El empleado no existe");
        }

        // Verificar que la tienda existe
        const storeQuery = "SELECT tienda_id FROM tiendas WHERE tienda_id = ?";
        const storeResult = await executeQuery(storeQuery, [tienda_id]);

        if (!storeResult.success || storeResult.data.length === 0) {
            throw new Error("La tienda no existe");
        }

        // Verificar conflictos de horarios
        let conflictQuery, conflictParams;

        if (horario_tipo_semanal === "semanal") {
            // Para horarios semanales, verificar conflictos en días de trabajo
            const diasTrabajoStr = JSON.stringify(dias_trabajo);
            conflictQuery = `
        SELECT horario_id FROM horarios 
        WHERE empleado_id = ? AND horario_tipo_semanal = 'semanal' 
        AND horario_estado = 1 AND JSON_OVERLAPS(dias_trabajo, ?)
        AND (
          (horario_inicio <= ? AND horario_fin > ?) OR
          (horario_inicio < ? AND horario_fin >= ?) OR
          (horario_inicio >= ? AND horario_fin <= ?)
        )
      `;
            conflictParams = [
                empleado_id,
                diasTrabajoStr,
                horario_inicio,
                horario_inicio,
                horario_fin,
                horario_fin,
                horario_inicio,
                horario_fin,
            ];
        } else {
            // Para horarios específicos, verificar conflictos en el día específico
            conflictQuery = `
        SELECT horario_id FROM horarios 
        WHERE empleado_id = ? AND horario_dia = ? AND horario_estado = 1
        AND (
          (horario_inicio <= ? AND horario_fin > ?) OR
          (horario_inicio < ? AND horario_fin >= ?) OR
          (horario_inicio >= ? AND horario_fin <= ?)
        )
      `;
            conflictParams = [
                empleado_id,
                horario_dia,
                horario_inicio,
                horario_inicio,
                horario_fin,
                horario_fin,
                horario_inicio,
                horario_fin,
            ];
        }

        const conflictResult = await executeQuery(
            conflictQuery,
            conflictParams
        );

        if (conflictResult.success && conflictResult.data.length > 0) {
            throw new Error(
                "Ya existe un horario conflictivo para este empleado"
            );
        }

        // Crear el horario
        const query = `
      INSERT INTO horarios 
      (empleado_id, tienda_id, horario_tipo_semanal, dias_trabajo, dias_descanso,
       fecha_inicio, fecha_fin, horario_nombre, horario_dia, horario_inicio, 
       horario_fin, horario_activo, horario_tipo, horario_estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const params = [
            empleado_id,
            tienda_id,
            horario_tipo_semanal,
            JSON.stringify(dias_trabajo),
            JSON.stringify(dias_descanso),
            fecha_inicio,
            fecha_fin,
            horario_nombre,
            horario_dia,
            horario_inicio,
            horario_fin,
            true,
            horario_tipo,
            this.STATES.ACTIVE,
        ];

        const result = await executeQuery(query, params);

        if (!result.success) {
            throw new Error(`Error al crear horario: ${result.error}`);
        }

        return {
            success: true,
            horario_id: result.data.insertId,
            message: "Horario creado exitosamente",
        };
    }

    // Actualizar horario
    static async updateSchedule(horario_id, updateData) {
        const {
            horario_tipo_semanal,
            dias_trabajo,
            dias_descanso,
            fecha_inicio,
            fecha_fin,
            horario_nombre,
            horario_dia,
            horario_inicio,
            horario_fin,
            horario_activo,
        } = updateData;

        // Verificar que el horario existe
        const existingQuery = "SELECT * FROM horarios WHERE horario_id = ?";
        const existingResult = await executeQuery(existingQuery, [horario_id]);

        if (!existingResult.success || existingResult.data.length === 0) {
            throw new Error("Horario no encontrado");
        }

        const existingSchedule = existingResult.data[0];

        // Validaciones si se proporcionan nuevos valores
        if (horario_inicio && horario_fin && horario_inicio >= horario_fin) {
            throw new Error(
                "La hora de inicio debe ser menor que la hora de fin"
            );
        }

        // Verificar conflictos si se cambian las horas o días
        if (horario_inicio || horario_fin || dias_trabajo) {
            const finalInicio =
                horario_inicio || existingSchedule.horario_inicio;
            const finalFin = horario_fin || existingSchedule.horario_fin;
            const finalTipo =
                horario_tipo_semanal || existingSchedule.horario_tipo_semanal;
            const finalDiasTrabajo =
                dias_trabajo ||
                JSON.parse(existingSchedule.dias_trabajo || "[]");

            let conflictQuery, conflictParams;

            if (finalTipo === "semanal") {
                const diasTrabajoStr = JSON.stringify(finalDiasTrabajo);
                conflictQuery = `
          SELECT horario_id FROM horarios 
          WHERE empleado_id = ? AND horario_tipo_semanal = 'semanal' 
          AND horario_id != ? AND horario_estado = 1 
          AND JSON_OVERLAPS(dias_trabajo, ?)
          AND (
            (horario_inicio <= ? AND horario_fin > ?) OR
            (horario_inicio < ? AND horario_fin >= ?) OR
            (horario_inicio >= ? AND horario_fin <= ?)
          )
        `;
                conflictParams = [
                    existingSchedule.empleado_id,
                    horario_id,
                    diasTrabajoStr,
                    finalInicio,
                    finalInicio,
                    finalFin,
                    finalFin,
                    finalInicio,
                    finalFin,
                ];
            } else {
                const finalDia = horario_dia || existingSchedule.horario_dia;
                conflictQuery = `
          SELECT horario_id FROM horarios 
          WHERE empleado_id = ? AND horario_dia = ? AND horario_id != ? AND horario_estado = 1
          AND (
            (horario_inicio <= ? AND horario_fin > ?) OR
            (horario_inicio < ? AND horario_fin >= ?) OR
            (horario_inicio >= ? AND horario_fin <= ?)
          )
        `;
                conflictParams = [
                    existingSchedule.empleado_id,
                    finalDia,
                    horario_id,
                    finalInicio,
                    finalInicio,
                    finalFin,
                    finalFin,
                    finalInicio,
                    finalFin,
                ];
            }

            const conflictResult = await executeQuery(
                conflictQuery,
                conflictParams
            );

            if (conflictResult.success && conflictResult.data.length > 0) {
                throw new Error(
                    "Ya existe un horario conflictivo para este empleado"
                );
            }
        }

        // Actualizar el horario
        const query = `
      UPDATE horarios 
      SET horario_tipo_semanal = COALESCE(?, horario_tipo_semanal),
          dias_trabajo = COALESCE(?, dias_trabajo),
          dias_descanso = COALESCE(?, dias_descanso),
          fecha_inicio = COALESCE(?, fecha_inicio),
          fecha_fin = COALESCE(?, fecha_fin),
          horario_nombre = COALESCE(?, horario_nombre),
          horario_dia = COALESCE(?, horario_dia),
          horario_inicio = COALESCE(?, horario_inicio),
          horario_fin = COALESCE(?, horario_fin),
          horario_activo = COALESCE(?, horario_activo)
      WHERE horario_id = ?
    `;

        const params = [
            horario_tipo_semanal,
            dias_trabajo ? JSON.stringify(dias_trabajo) : null,
            dias_descanso ? JSON.stringify(dias_descanso) : null,
            fecha_inicio,
            fecha_fin,
            horario_nombre,
            horario_dia,
            horario_inicio,
            horario_fin,
            horario_activo,
            horario_id,
        ];

        const result = await executeQuery(query, params);

        if (!result.success) {
            throw new Error(`Error al actualizar horario: ${result.error}`);
        }

        return {
            success: true,
            message: "Horario actualizado exitosamente",
        };
    }

    // Eliminar horario (soft delete)
    static async deleteSchedule(horario_id) {
        try {
            const query = `
        UPDATE horarios 
        SET horario_estado = 0, horario_activo = false
        WHERE horario_id = ?
      `;

            const result = await executeQuery(query, [horario_id]);

            if (!result.success) {
                throw new Error(`Error al eliminar horario: ${result.error}`);
            }

            return {
                success: true,
                message: "Horario eliminado exitosamente",
            };
        } catch (error) {
            throw new Error(`Error al eliminar horario: ${error.message}`);
        }
    }

    // Obtener horarios por propietario (todos los empleados de sus tiendas)
    static async getSchedulesByOwner(propietario_id) {
        try {
            const query = `
        SELECT 
          h.*,
          t.tienda_nombre,
          t.tienda_direccion,
          e.empleado_especialidad,
          u.usuario_nombre,
          u.usuario_apellido,
          n.negocio_nombre
        FROM horarios h
        LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
        LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
        LEFT JOIN tiendas t ON h.tienda_id = t.tienda_id
        LEFT JOIN negocios n ON t.negocio_id = n.negocio_id
        WHERE n.propietario_id = ? AND h.horario_estado = 1
        ORDER BY 
          n.negocio_nombre,
          t.tienda_nombre,
          u.usuario_nombre,
          h.horario_tipo_semanal,
          h.horario_nombre,
          h.horario_inicio
      `;

            const result = await executeQuery(query, [propietario_id]);

            if (!result.success) {
                throw new Error(`Error al obtener horarios: ${result.error}`);
            }

            // Procesar los datos para parsear JSON
            const processedData = result.data.map((schedule) => ({
                ...schedule,
                dias_trabajo: schedule.dias_trabajo
                    ? JSON.parse(schedule.dias_trabajo)
                    : [],
                dias_descanso: schedule.dias_descanso
                    ? JSON.parse(schedule.dias_descanso)
                    : [],
            }));

            return processedData;
        } catch (error) {
            throw new Error(
                `Error al obtener horarios del propietario: ${error.message}`
            );
        }
    }

    // Obtener horarios disponibles por empleado y fecha (para agendamiento de citas)
    static async getAvailableSchedulesByEmployee(
        empleado_id,
        fecha,
        duracion_servicio = 30
    ) {
        try {
            // Forzar la fecha a medianoche en Colombia (UTC-5)
            const [year, month, day] = fecha.split("-");
            // 5am UTC = 00:00 COT
            const fechaDate = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
            const diaSemana = fechaDate.getUTCDay(); // 0 = Domingo, 1 = Lunes, etc.
            const diaSemanaNum = diaSemana === 0 ? 7 : diaSemana; // 1=Lunes, 7=Domingo

            console.log(
                `🔍 Buscando horarios para empleado ${empleado_id}, fecha ${fecha}, día de semana ${diaSemanaNum}`
            );

            // Primero, vamos a ver qué horarios existen para este empleado
            const debugQuery = `
        SELECT 
          h.*,
          t.tienda_nombre,
          e.empleado_especialidad,
          u.usuario_nombre,
          u.usuario_apellido
        FROM horarios h
        LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
        LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
        LEFT JOIN tiendas t ON h.tienda_id = t.tienda_id
        WHERE h.empleado_id = ?
        ORDER BY h.horario_inicio
      `;

            console.log(
                "🔍 Consulta de debug - todos los horarios del empleado:"
            );
            const debugResult = await executeQuery(debugQuery, [empleado_id]);
            console.log(
                "📋 Todos los horarios del empleado:",
                debugResult.data
            );

            // Buscar horarios semanales que apliquen para este día
            const query = `
                    SELECT 
                        h.*,
                        t.tienda_nombre,
                        e.empleado_especialidad,
                        u.usuario_nombre,
                        u.usuario_apellido
                    FROM horarios h
                    LEFT JOIN empleados e ON h.empleado_id = e.empleado_id
                    LEFT JOIN usuarios u ON e.usuario_id = u.usuario_id
                    LEFT JOIN tiendas t ON h.tienda_id = t.tienda_id
                    WHERE h.empleado_id = ? 
                        AND h.horario_estado = 1 
                        AND h.horario_activo = 1
                        AND (
                        (
                            h.horario_tipo_semanal = 'semanal'
                            AND (h.dias_trabajo LIKE ? OR h.dias_trabajo LIKE ?)
                            AND (h.fecha_inicio IS NULL OR h.fecha_inicio <= ?)
                            AND (
                            h.fecha_fin IS NULL 
                            OR h.fecha_fin >= ?
                            )
                        )
                        OR (
                            h.horario_tipo_semanal = 'especifico'
                            AND h.horario_dia = ?
                        )
                        )
                    ORDER BY h.horario_inicio
`;




            // Crear patrones de búsqueda para el día de la semana
            const dayPattern1 = `%"${diaSemanaNum}"%`; // Para formato ["1","2","3"]
            const dayPattern2 = `%${diaSemanaNum}%`; // Para formato [1,2,3] o [null,1,2,3]

            console.log("🔍 Parámetros de la consulta principal:", {
                empleado_id,
                diaSemanaNum,
                dayPattern1,
                dayPattern2,
                fecha,
            });

            const result = await executeQuery(query, [
                empleado_id,
                dayPattern1,
                dayPattern2,
                fecha,
                fecha,
                fecha,
            ]);

            console.log("🔍 Resultado de la consulta principal:", result.data);

            if (!result.success) {
                throw new Error(`Error al obtener horarios: ${result.error}`);
            }

            // Procesar los datos y generar slots de tiempo
            const processedData = result.data.map((schedule) => {
                // Limpiar y parsear dias_trabajo
                let diasTrabajo = [];
                if (schedule.dias_trabajo) {
                    try {
                        const parsed = JSON.parse(schedule.dias_trabajo);
                        // Filtrar valores null y convertir a números
                        diasTrabajo = parsed
                            .filter((day) => day !== null && day !== undefined)
                            .map((day) => parseInt(day));
                    } catch (error) {
                        console.error(
                            "Error parseando dias_trabajo:",
                            schedule.dias_trabajo,
                            error
                        );
                        diasTrabajo = [];
                    }
                }

                // Limpiar y parsear dias_descanso
                let diasDescanso = [];
                if (schedule.dias_descanso) {
                    try {
                        const parsed = JSON.parse(schedule.dias_descanso);
                        diasDescanso = parsed
                            .filter((day) => day !== null && day !== undefined)
                            .map((day) => parseInt(day));
                    } catch (error) {
                        console.error(
                            "Error parseando dias_descanso:",
                            schedule.dias_descanso,
                            error
                        );
                        diasDescanso = [];
                    }
                }

                return {
                    ...schedule,
                    dias_trabajo: diasTrabajo,
                    dias_descanso: diasDescanso,
                };
            });

            console.log(`📋 Horarios encontrados en BD:`, processedData.length);
            console.log(`📋 Datos de horarios:`, processedData);

            // Generar slots de tiempo para cada horario
            const timeSlots = [];
            for (const schedule of processedData) {
                console.log(`🔄 Procesando horario:`, {
                    horario_id: schedule.horario_id,
                    horario_inicio: schedule.horario_inicio,
                    horario_fin: schedule.horario_fin,
                    horario_tipo_semanal: schedule.horario_tipo_semanal,
                    tienda_id: schedule.tienda_id,
                });

                // Siempre crear o asegurar la existencia de franjas para la fecha seleccionada
                const slots = await this.generateTimeSlots(
                    schedule.horario_inicio,
                    schedule.horario_fin,
                    duracion_servicio,
                    schedule.horario_id,
                    empleado_id,
                    schedule.tienda_id,
                    fecha
                );
                timeSlots.push(...slots);
            }

            // Si no se generó ningún slot con franja_id, intentar forzar la generación de franjas para la fecha
            if (
                timeSlots.length > 0 &&
                !timeSlots.some((slot) => slot.franja_id)
            ) {
                console.log(
                    "⚠️ No se generaron franjas, forzando generación para la fecha:",
                    fecha
                );
                for (const schedule of processedData) {
                    await this.generateTimeSlots(
                        schedule.horario_inicio,
                        schedule.horario_fin,
                        duracion_servicio,
                        schedule.horario_id,
                        empleado_id,
                        schedule.tienda_id,
                        fecha
                    );
                }
                // Volver a consultar los slots
                return await this.getAvailableSchedulesByEmployee(
                    empleado_id,
                    fecha,
                    duracion_servicio
                );
            }

            console.log(
                `✅ Encontrados ${timeSlots.length} slots de tiempo para el empleado ${empleado_id}`
            );
            return timeSlots;
        } catch (error) {
            throw new Error(
                `Error al obtener horarios disponibles: ${error.message}`
            );
        }
    }

    // Generar slots de tiempo basados en un rango de horario
    static async generateTimeSlots(
        horaInicio,
        horaFin,
        duracionMinutos,
        horarioId,
        empleadoId,
        tiendaId,
        fecha
    ) {
        const slots = [];
        const inicio = new Date(`2000-01-01T${horaInicio}`);
        const fin = new Date(`2000-01-01T${horaFin}`);

        console.log(
            `🕐 Generando slots desde ${horaInicio} hasta ${horaFin} con duración ${duracionMinutos} min`
        );

        let currentTime = new Date(inicio);

        while (currentTime < fin) {
            const slotFin = new Date(
                currentTime.getTime() + duracionMinutos * 60000
            );

            // Verificar que el slot no exceda el horario de fin
            if (slotFin <= fin) {
                const slotInicioStr = currentTime.toTimeString().slice(0, 5);
                const slotFinStr = slotFin.toTimeString().slice(0, 5);

                // Crear o obtener franja horaria real
                const franjaId = await this.createOrGetFranjaHoraria(
                    horarioId,
                    empleadoId,
                    tiendaId,
                    fecha,
                    slotInicioStr,
                    slotFinStr,
                    duracionMinutos
                );

                const slot = {
                    slot_id: `slot-${horarioId}-${slotInicioStr.replace(
                        ":",
                        ""
                    )}`,
                    franja_id: franjaId,
                    horario_id: horarioId,
                    slot_inicio: slotInicioStr,
                    slot_fin: slotFinStr,
                    horario_inicio: slotInicioStr,
                    horario_fin: slotFinStr,
                    horario_hora_inicio: slotInicioStr,
                    horario_hora_fin: slotFinStr,
                    franja_disponible: true,
                    franja_duracion_minutos: duracionMinutos,
                };

                console.log(`✅ Slot generado con franja_id:`, slot);
                slots.push(slot);
            }

            // Avanzar al siguiente slot
            currentTime = new Date(
                currentTime.getTime() + duracionMinutos * 60000
            );
        }

        console.log(`📊 Total de slots generados: ${slots.length}`);
        return slots;
    }

    // Crear o obtener franja horaria real en la base de datos
    static async createOrGetFranjaHoraria(
        horarioId,
        empleadoId,
        tiendaId,
        fecha,
        horaInicio,
        horaFin,
        duracionMinutos
    ) {
        try {
            // Primero verificar si ya existe una franja para este horario específico
            const checkQuery = `
        SELECT franja_id FROM franjas_horarias 
        WHERE horario_id = ? 
          AND empleado_id = ? 
          AND tienda_id = ? 
          AND franja_fecha = ? 
          AND franja_hora_inicio = ? 
          AND franja_hora_fin = ?
      `;

            const checkResult = await executeQuery(checkQuery, [
                horarioId,
                empleadoId,
                tiendaId,
                fecha,
                horaInicio,
                horaFin,
            ]);

            if (checkResult.success && checkResult.data.length > 0) {
                console.log(
                    `✅ Franja existente encontrada: ${checkResult.data[0].franja_id}`
                );
                return checkResult.data[0].franja_id;
            }

            // Si no existe, crear una nueva franja
            const insertQuery = `
        INSERT INTO franjas_horarias 
        (horario_id, empleado_id, tienda_id, franja_fecha, franja_hora_inicio, franja_hora_fin, franja_disponible, franja_duracion_minutos, franja_estado)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?, 1)
      `;

            const insertResult = await executeQuery(insertQuery, [
                horarioId,
                empleadoId,
                tiendaId,
                fecha,
                horaInicio,
                horaFin,
                duracionMinutos,
            ]);

            if (insertResult.success) {
                console.log(
                    `✅ Nueva franja creada con ID: ${insertResult.insertId}`
                );
                return insertResult.insertId;
            } else {
                throw new Error(
                    `Error creando franja horaria: ${insertResult.error}`
                );
            }
        } catch (error) {
            console.error("❌ Error en createOrGetFranjaHoraria:", error);
            throw error;
        }
    }
}

export default Schedule;
