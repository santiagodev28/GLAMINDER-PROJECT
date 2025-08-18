import Appointment from "../models/Appointment.js";

class AppointmentsController {
    static async getAllAppointments(req, res) {
        try {
            const filters = req.query;
            const appointments = await Appointment.getAllAppointments(filters);
            res.json(appointments);
        } catch (error) {
            console.error("Error al obtener citas:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getAppointmentById(req, res) {
        try {
            const { cita_id } = req.params;
            const appointment = await Appointment.getAppointmentById(cita_id);
            if (!appointment) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }
            res.json(appointment);
        } catch (error) {
            console.error("Error al obtener cita:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async createAppointment(req, res) {
        try {
            const appointmentData = req.body;
            const result = await Appointment.createAppointment(appointmentData);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error al crear cita:", error.message);
            res.status(400).json({ error: error.message });
        }
    }

    static async updateAppointment(req, res) {
        try {
            const { cita_id } = req.params;
            const updateData = req.body;
            const result = await Appointment.updateAppointment(cita_id, updateData);
            res.json(result);
        } catch (error) {
            if (error.message === "Cita no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    static async changeStateAppointment(req, res) {
        try {
            const { cita_id } = req.params;
            const { nuevo_estado } = req.body;
            const result = await Appointment.changeStateAppointment(cita_id, nuevo_estado);
            res.json(result);
        } catch (error) {
            if (error.message.includes("Cita no encontrada")) {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    static async cancelAppointment(req, res) {
        try {
            const { cita_id } = req.params;
            const { motivo } = req.body;
            const result = await Appointment.cancelAppointment(cita_id, motivo);
            res.json(result);
        } catch (error) {
            if (error.message === "Cita no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    static async confirmAppointment(req, res) {
        try {
            const { cita_id } = req.params;
            const result = await Appointment.confirmAppointment(cita_id);
            res.json(result);
        } catch (error) {
            if (error.message === "Cita no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    static async completeAppointment(req, res) {
        try {
            const { cita_id } = req.params;
            const { observaciones } = req.body;
            const result = await Appointment.completeAppointment(cita_id, observaciones);
            res.json(result);
        } catch (error) {
            if (error.message === "Cita no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteAppointment(req, res) {
        try {
            const { cita_id } = req.params;
            const result = await Appointment.deleteAppointment(cita_id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAppointmentsByUser(req, res) {
        try {
            const { usuario_id } = req.params;
            const { estado } = req.query;
            const appointments = await Appointment.getAppointmentsByUser(usuario_id, estado);
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAppointmentsByEmployee(req, res) {
        try {
            const { empleado_id } = req.params;
            const { fecha } = req.query;
            const appointments = await Appointment.getAppointmentsByEmployee(empleado_id, fecha);
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvailableTimeSlots(req, res) {
        try {
            const { empleado_id } = req.params;
            const { fecha } = req.query;
            const slots = await Appointment.getAvailableTimeSlots(empleado_id, fecha);
            res.json(slots);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAppointmentStats(req, res) {
        try {
            const filters = req.query;
            const stats = await Appointment.getAppointmentStats(filters);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default AppointmentsController;
