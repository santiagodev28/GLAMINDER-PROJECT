# 📋 Sistema de Consentimientos

## Descripción
Sistema completo para registrar y gestionar consentimientos de usuarios, cumpliendo con requisitos legales (RGPD, LOPD, etc.).

## Tabla de Consentimientos

La tabla `consentimientos` almacena:
- **Quién** aceptó (usuario_id)
- **Qué** aceptó (tipo_consentimiento: TERMINOS_CONDICIONES, POLITICA_PRIVACIDAD, MARKETING, etc.)
- **Cuándo** aceptó (fecha_consentimiento)
- **Versión** del documento aceptado
- **IP y User Agent** para auditoría
- **Fecha de revocación** si el usuario revoca el consentimiento

## Instalación

### Opción 1: Ejecutar script SQL directamente
```bash
mysql -u tu_usuario -p tu_base_de_datos < consentimientos.sql
```

### Opción 2: Ejecutar desde MySQL Workbench/phpMyAdmin
1. Abre el archivo `consentimientos.sql`
2. Copia y pega el contenido
3. Ejecuta el script

### Opción 3: Ya incluido en glaminderdb.sql
La tabla ya está incluida en el script principal `glaminderdb.sql` al final del archivo.

## Funcionalidades Implementadas

### ✅ Frontend
- Checkbox obligatorio de aceptación de términos en el registro
- Validación que requiere aceptar términos antes de registrar
- Enlaces a términos y condiciones y política de privacidad
- Botón deshabilitado si no se aceptan términos

### ✅ Backend
- Validación de aceptación de términos antes de crear usuario
- Registro automático del consentimiento al crear usuario
- Almacenamiento de IP y User Agent para auditoría
- Versión de términos registrada

### ✅ Base de Datos
- Tabla `consentimientos` con todos los campos necesarios
- Índices para búsquedas eficientes
- Foreign key con cascade delete

## Modelo Consent

El modelo `Consent.js` proporciona métodos para:
- `recordConsent()` - Registrar un nuevo consentimiento
- `revokeConsent()` - Revocar un consentimiento existente
- `getUserConsents()` - Obtener todos los consentimientos de un usuario
- `hasActiveConsent()` - Verificar si un usuario tiene un consentimiento activo
- `getCurrentTermsVersion()` - Obtener la versión actual de términos

## Tipos de Consentimiento

Actualmente implementado:
- `TERMINOS_CONDICIONES` - Términos y condiciones del servicio

Futuros (fácil de agregar):
- `POLITICA_PRIVACIDAD` - Política de privacidad
- `MARKETING` - Consentimiento para marketing/emails promocionales
- `COOKIES` - Consentimiento para cookies

## Ejemplo de Uso

### Registrar consentimiento manualmente
```javascript
import Consent from './models/Consent.js';

await Consent.recordConsent({
  usuario_id: 123,
  tipo_consentimiento: 'TERMINOS_CONDICIONES',
  version: '1.0',
  aceptado: true,
  ip_address: req.ip,
  user_agent: req.get('user-agent')
});
```

### Verificar consentimiento
```javascript
const hasConsent = await Consent.hasActiveConsent(usuario_id, 'TERMINOS_CONDICIONES');
```

### Revocar consentimiento
```javascript
await Consent.revokeConsent(usuario_id, 'TERMINOS_CONDICIONES');
```

## Próximos Pasos

1. Crear páginas de Términos y Condiciones y Política de Privacidad
2. Agregar opción para que usuarios revoquen consentimientos
3. Implementar consentimiento para marketing (opcional)
4. Agregar panel de administración para ver consentimientos

