# 📘 Guía de Estándares de Código - Proyecto Glaminder

Esta guía establece los estándares de codificación para el desarrollo del proyecto Glaminder utilizando el stack Node.js + Express (backend) y React + Vite (frontend).

## a. Reglas de nombres

### Variables
- ✅ camelCase para variables locales y globales.

```js
let userName = "Santiago";
const maxAttempts = 3;
```

❌ No usar nombres genéricos o abreviaciones sin sentido.

```js
let x = 5; // ❌
let usrNm = "Juan"; // ❌
```

### Clases
✅ PascalCase para clases y constructores.

```js
class UserController {}
class AppointmentService {}
```

### Métodos y funciones
✅ camelCase para funciones y métodos.

```js
function createUser() {}
const getAppointments = () => {};
```

## b. Comentarios y documentación interna

### Reglas
- Usar comentarios para explicar el "por qué" del código, no el "qué" si ya es evidente.
- Preferir comentarios en inglés para mantener consistencia si el equipo es mixto.

**Ejemplo correcto:**
```js
// Validate user token before granting access
function validateToken(token) {
  // Logic to decode and verify JWT
}
```

❌ **Ejemplo incorrecto:**
```js
// Esto es una función
function login() {}
```

## c. Identación y estilo de código

- Usar 2 espacios por nivel de indentación.
- Abrir llaves en la misma línea de la declaración (K&R style).

```js
if (isValid) {
  console.log("Valid input");
} else {
  console.log("Invalid input");
}
```

- Las funciones flecha deben tener espacio entre los paréntesis y la flecha:

```js
const sayHello = () => {
  console.log("Hello!");
};
```

## d. Ejemplos aceptados y no aceptados

✅ **Aceptado:**
```js
const user = {
  id: 1,
  name: "Santiago",
};

function getUserName(user) {
  return user.name;
}
```

❌ **No aceptado:**
```js
var user = {id:1,name:"Santiago"};

function get_user_name(u){
return u.name;
}
```

📌 **Nota:** Estas reglas deben ser aplicadas tanto en el frontend como en el backend. El uso de linters como ESLint y Prettier es altamente recomendado para mantener la consistencia.