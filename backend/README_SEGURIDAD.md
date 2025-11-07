# 🔐 Mejoras de Seguridad Implementadas

Este documento describe las mejoras de seguridad implementadas en el proyecto Glaminder.

## ✅ Funcionalidades Implementadas

### 1. Confirmación de Registro por Correo
- **Estado:** ✅ Implementado
- **Descripción:** Los usuarios deben verificar su correo electrónico antes de poder iniciar sesión
- **Endpoints:**
  - `GET /api/auth/verificar-email/:token` - Verificar email con token
  - `POST /api/auth/reenviar-verificacion` - Reenviar token de verificación
- **Campos en BD:** `email_verificado`, `email_verification_token`, `email_verification_expires`

### 2. Refresh Tokens
- **Estado:** ✅ Implementado
- **Descripción:** Sistema de refresh tokens para renovar access tokens sin requerir login
- **Endpoints:**
  - `POST /api/auth/refresh-token` - Renovar access token con refresh token
- **Tabla:** `refresh_tokens`
- **Duración:** Access token (1h), Refresh token (7 días)

### 3. Rate Limiting
- **Estado:** ✅ Implementado
- **Descripción:** Protección contra ataques de fuerza bruta y abuso de API
- **Límites:**
  - **API General:** 100 requests por IP en 15 minutos
  - **Login:** 5 intentos por IP en 15 minutos
  - **Registro:** 3 intentos por IP en 1 hora
  - **Recuperación de contraseña:** 3 solicitudes por IP en 1 hora

### 4. Protección XSS/CSRF
- **Estado:** ✅ Implementado
- **Helmet:** Configurado para proteger headers HTTP
- **CSRF:** Configurado (puede aplicarse selectivamente a rutas específicas)
- **Nota:** CSRF puede causar problemas con APIs REST puras, se aplica selectivamente

### 5. Auditoría de Acciones
- **Estado:** ✅ Implementado
- **Descripción:** Registro de todas las acciones críticas (crear, editar, eliminar, login, logout)
- **Tabla:** `auditoria`
- **Información registrada:**
  - Usuario que realizó la acción
  - Tipo de acción (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.)
  - Tabla afectada
  - Datos anteriores y nuevos (para UPDATE)
  - IP address y User Agent
  - Fecha y hora

### 6. Invalidación de Tokens
- **Estado:** ✅ Implementado
- **Descripción:** Sistema de blacklist para invalidar tokens al cerrar sesión
- **Endpoints:**
  - `POST /api/auth/cerrar-sesion` - Cerrar sesión (invalida token actual)
  - `POST /api/auth/cerrar-sesion-todos` - Cerrar sesión en todos los dispositivos
- **Tabla:** `token_blacklist`

## 📋 Instalación de Dependencias

Ejecuta el siguiente comando para instalar las nuevas dependencias:

```bash
cd GLAMINDER-PROJECT/backend
npm install
```

Dependencias agregadas:
- `express-rate-limit` - Rate limiting
- `helmet` - Protección de headers
- `csurf` - Protección CSRF
- `uuid` - Generación de IDs únicos para tokens

## 🗄️ Actualización de Base de Datos

Ejecuta el script SQL actualizado para crear las nuevas tablas:

```bash
mysql -u tu_usuario -p glaminderdb < database/glaminderdb.sql
```

O ejecuta manualmente las secciones nuevas del script SQL que incluyen:
- Campos de verificación de email en tabla `usuarios`
- Tabla `auditoria`
- Tabla `token_blacklist`
- Tabla `refresh_tokens`

## ⚙️ Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```env
# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_REFRESH_SECRET=tu_secreto_refresh_token_opcional (si no se define, usa JWT_SECRET)

# Email
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# URLs
APP_BASE_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

## 🔄 Limpieza de Tokens Expirados

Se recomienda ejecutar periódicamente (cada hora) un script para limpiar tokens expirados:

```bash
node utils/cleanupTokens.js
```

O configurar un cron job:
```bash
0 * * * * cd /ruta/al/proyecto/backend && node utils/cleanupTokens.js
```

## 📝 Notas Importantes

1. **Verificación de Email:** Los usuarios nuevos NO pueden iniciar sesión hasta verificar su email
2. **Refresh Tokens:** Se almacenan en BD y pueden ser revocados
3. **Rate Limiting:** Los límites son estrictos para login y registro para prevenir abusos
4. **Auditoría:** Todas las acciones críticas se registran automáticamente
5. **Blacklist:** Los tokens invalidados se mantienen hasta su expiración natural

## 🧪 Pruebas

Para probar las nuevas funcionalidades:

1. **Registro con verificación:**
   - Registra un nuevo usuario
   - Revisa el correo (o la consola en desarrollo) para el enlace de verificación
   - Intenta iniciar sesión sin verificar (debe fallar)
   - Verifica el email y luego inicia sesión

2. **Refresh Token:**
   - Inicia sesión y guarda el `refreshToken`
   - Espera a que expire el `accessToken` (o usa uno expirado)
   - Usa el `refreshToken` para obtener un nuevo `accessToken`

3. **Rate Limiting:**
   - Intenta hacer más de 5 logins fallidos en 15 minutos
   - Deberías recibir un error 429

4. **Cerrar sesión:**
   - Inicia sesión
   - Cierra sesión
   - Intenta usar el token anterior (debe fallar)

## 🚀 Próximos Pasos

- [ ] Implementar frontend para verificación de email
- [ ] Implementar manejo de refresh tokens en frontend
- [ ] Agregar interfaz de administración para ver auditoría
- [ ] Configurar limpieza automática de tokens con cron job

