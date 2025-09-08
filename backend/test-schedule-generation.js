// Script para probar la generación de horarios
const Schedule = require("./models/Schedule.js").default;

async function testScheduleGeneration() {
  try {
    console.log("🔍 Probando generación de horarios...");

    const empleado_id = 1;
    const fecha = "2025-09-09";

    console.log(`👤 Empleado: ${empleado_id}`);
    console.log(`📅 Fecha: ${fecha}`);

    const schedules = await Schedule.getAvailableSchedulesByEmployee(
      empleado_id,
      fecha
    );

    console.log("✅ Método ejecutado exitosamente");
    console.log("📅 Total de slots generados:", schedules.length);

    if (schedules.length > 0) {
      console.log("\n📅 Primeros 10 slots:");
      schedules.slice(0, 10).forEach((slot, index) => {
        console.log(
          `${index + 1}. ${slot.horario_inicio} - ${slot.horario_fin} (${
            slot.franja_duracion_minutos
          } min) - Franja: ${slot.franja_id}`
        );
      });
    } else {
      console.log("❌ No se generaron slots");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

testScheduleGeneration();
