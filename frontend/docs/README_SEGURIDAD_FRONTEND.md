# 🔐 Funcionalidades de Seguridad - Frontend

Este documento describe las funcionalidades de seguridad implementadas en el frontend de Glaminder.

## ✅ Funcionalidades Implementadas

### 1. Verificación de Email
- **Componente:** `VerifyEmail.jsx`
- **Ruta:** `/verificar-email/:token`
- **Funcionalidad:**
  - Verifica el email del usuario al hacer clic en el enlace del correo
  - Muestra estados: verificando, éxito, error
  - Permite reenviar correo de verificación si el token expiró
  - Redirige automáticamente al login después de verificar

### 2. Refresh Tokens
- **Implementación:** Automática en `api.js`
- **Funcionalidad:**
  - Renovación automática de access tokens cuando expiran
  - Interceptor de axios que detecta errores 401
  - Cola de peticiones durante la renovación
  - Redirección al login si el refresh token también expiró

### 3. Manejo de Tokens
- **Almacenamiento:**
  - `accessToken` en localStorage
  - `refreshToken` en localStorage
- **Actualización automática:** Los tokens se renuevan automáticamente sin intervención del usuario

### 4. Cerrar Sesión
- **Funcionalidad:**
  - `logout(false)` - Cierra sesión en el dispositivo actual
  - `logout(true)` - Cierra sesión en todos los dispositivos
- **Componentes actualizados:**
  - `ButtonCloseSession.jsx` - Botón reutilizable
  - `AdminLayout.jsx` - Layout de administrador
  - Otros layouts pueden usar `ButtonCloseSession`

### 5. Validación de Email en Login
- **Funcionalidad:**
  - Verifica si el email está verificado antes de permitir login
  - Muestra mensaje claro si el email no está verificado
  - Opción para reenviar correo de verificación directamente desde el login

### 6. Mensajes de Verificación en Registro
- **Funcionalidad:**
  - Muestra mensaje claro sobre verificación de email después del registro
  - Guarda el email registrado para facilitar reenvío

## 📁 Archivos Modificados/Creados

### Nuevos Componentes
- `features/auth/components/VerifyEmail.jsx` - Componente de verificación de email

### Archivos Actualizados
- `services/authService.js` - Nuevos métodos:
  - `verifyEmail(token)`
  - `resendVerificationEmail(email)`
  - `refreshAccessToken()`
  - `logout(logoutAll)`
- `api/api.js` - Interceptor para renovación automática de tokens
- `features/auth/components/LoginForm.jsx` - Manejo de verificación de email
- `features/auth/components/RegisterForm.jsx` - Mensaje de verificación
- `routes/AppRoutes.jsx` - Ruta de verificación de email
- `components/buttons/ButtonCloseSession.jsx` - Nuevo logout con invalidación
- `layouts/AdminLayout.jsx` - Logout actualizado

## 🔄 Flujo de Verificación de Email

1. Usuario se registra → Recibe correo con enlace
2. Usuario hace clic en enlace → Redirige a `/verificar-email/:token`
3. Componente `VerifyEmail` verifica el token
4. Si es válido → Email verificado, redirige a login
5. Si expiró → Muestra opción para reenviar correo

## 🔄 Flujo de Refresh Tokens

1. Usuario hace login → Recibe `accessToken` y `refreshToken`
2. `accessToken` expira (1 hora) → Interceptor detecta error 401
3. Automáticamente usa `refreshToken` para obtener nuevo `accessToken`
4. Reintenta la petición original con el nuevo token
5. Si `refreshToken` también expiró → Redirige al login

## 🔄 Flujo de Cerrar Sesión

1. Usuario hace clic en "Cerrar sesión"
2. Frontend envía `refreshToken` al backend
3. Backend invalida tokens (blacklist)
4. Frontend limpia localStorage
5. Redirige al home/login

## 🧪 Pruebas

### Verificación de Email
1. Registra un nuevo usuario
2. Revisa el correo (o la consola en desarrollo) para el enlace
3. Haz clic en el enlace o copia la URL
4. Deberías ver la página de verificación
5. Después de verificar, deberías ser redirigido al login

### Refresh Tokens
1. Inicia sesión
2. Espera 1 hora (o modifica la expiración en desarrollo)
3. Intenta hacer una petición
4. El token debería renovarse automáticamente
5. La petición debería completarse sin errores

### Cerrar Sesión
1. Inicia sesión
2. Haz clic en "Cerrar sesión"
3. Intenta usar el token anterior (debería fallar)
4. Deberías ser redirigido al home

## 📝 Notas Importantes

1. **Tokens:** Los tokens se almacenan en localStorage. En producción, considera usar httpOnly cookies para mayor seguridad.

2. **Renovación Automática:** La renovación de tokens es transparente para el usuario. No necesita hacer nada.

3. **Verificación de Email:** Los usuarios NO pueden iniciar sesión hasta verificar su email.

4. **Rate Limiting:** El backend limita los intentos de login, registro y recuperación de contraseña.

5. **Cerrar Sesión en Todos los Dispositivos:** Usa `logout(true)` para invalidar todas las sesiones.

## 🚀 Próximos Pasos

- [ ] Agregar opción de "Cerrar sesión en todos los dispositivos" en el menú de usuario
- [ ] Mostrar notificación cuando el token se renueva automáticamente (opcional)
- [ ] Agregar contador de tiempo restante del token (opcional)
- [ ] Implementar recordatorio de verificación de email si no se ha verificado en X días

