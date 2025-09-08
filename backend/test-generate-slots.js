// Script para probar generateTimeSlots directamente
const FranjaHoraria = require('./models/FranjaHoraria.js').default;

console.log('🔍 Probando generateTimeSlots directamente...');

// Probar con la franja 14:00:00 - 17:00:00
console.log('\n📅 Probando 14:00:00 - 17:00:00:');
const slots = FranjaHoraria.generateTimeSlots('14:00:00', '17:00:00', 30);
console.log('📅 Slots generados:', slots.length);
console.log('📅 Slots:', slots);

// Probar con la franja 9:00:00 - 12:00:00
console.log('\n📅 Probando 09:00:00 - 12:00:00:');
const slots2 = FranjaHoraria.generateTimeSlots('09:00:00', '12:00:00', 30);
console.log('📅 Slots generados:', slots2.length);
console.log('📅 Slots:', slots2);

console.log('\n✅ Prueba completada');
