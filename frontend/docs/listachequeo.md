Lista de Chequeo - Fase Desarrollo ADSO
Aprendiz, recuerda que estamos en la fase (Planeación-Ejecución) del proyecto formativo del SENA; y para el desarrollo de nuestro proyecto estamos aplicando el marco de trabajo ágil llamado SCRUM enfocado al desarrollo de software. Así que no olvides el TABLERO de los Sprint para revisión de cada uno de los siguientes aspectos.

📊 Base de Datos (MySQL/MongoDB)
AspectoCumpleLa base de datos es funcional según los requisitos del proyecto (tablas/colecciones, registros/documentos, los tipos de datos coherentes)☐Se respeta la integridad referencial (llaves primarias, foráneas, únicas)☐La información almacenada es pertinente y coherente con los requisitos☐Existen vistas, procedimientos almacenados y/o consultas agregadas según necesidad del sistema (opcional en Mongo)☐Se controla la duplicidad de datos☐Se almacena fecha/hora de registros y acciones críticas para auditoría☐

🎨 Frontend – Interfaz Gráfica / Usabilidad (React/React Native)
AspectoCumpleExiste pantalla de inicio (Home)☐Existe un dashboard claro y específico según rol del usuario☐La interfaz incluye header, footer y menú de navegación☐Se visualiza el nombre del usuario en sesión y su rol☐Diseño consistente entre módulos, sin errores ortográficos☐UI amigable: contraste, tipografías legibles, iconos coherentes, navegación intuitiva☐Se implementa diseño responsive (RWD) y adaptado al dispositivo (AWD si es app móvil)☐Se usan componentes adecuados (modales, tabs, acordeones, formularios, etc.)☐Formularios con placeholders, labels claros, asteriscos para campos obligatorios☐Orden lógico de campos y validaciones en tiempo real☐Formularios muestran mensajes de error y confirmación específicos☐Tablas: paginación, filtros de búsqueda, ordenamiento, consultas dinámicas☐Implementa breadcrumbs y resalta la opción activa del menú☐Cumple con la regla del "tercer clic" (máximo 3 pasos para acceder a funciones clave)☐La carga de información es dinámica (sin recargar la página, uso de AJAX/fetch/axios)☐

⚙️ Backend – Lógica del Sistema (Node.js / Python + Express/FastAPI/Django)
AspectoCumpleImplementa una API REST clara y documentada (endpoints organizados)☐Cumple con reglas de negocio y estados definidos (core del sistema)☐Controla validaciones de datos: tipos, longitud, campos vacíos, formatos☐Manejo correcto de excepciones con mensajes coherentes☐Implementa CRUD básico en cada módulo☐Genera reportes parametrizados (por fechas, estado, filtros específicos)☐Permite cargas masivas cuando el módulo lo requiere☐Tiempo de respuesta adecuado (no bloquea al usuario en operaciones simples)☐

🔐 Seguridad y Autenticación
AspectoCumpleRegistro de usuarios con validaciones (email único, contraseña segura)☐Encriptación de contraseñas (bcrypt, Argon2)☐Confirmación de registro vía correo con enlace único y expiración☐Inicio de sesión con correo/contraseña validando credenciales☐Uso de tokens seguros (JWT con expiración + refresh)☐Bloqueo temporal tras intentos fallidos (rate limiting opcional)☐Recuperación de contraseña vía correo con token temporal☐Roles y permisos definidos (ejemplo: admin, instructor, estudiante)☐Rutas sensibles protegidas con middleware/guards☐Auditoría de acciones críticas (guardar usuario que edita/elimina)☐Al cerrar sesión, tokens/cookies quedan invalidados☐Protección contra XSS, CSRF e inyección SQL/NoSQL☐Uso de HTTPS en producción☐

👤 Experiencia de Usuario
AspectoCumpleMensajes claros de error y éxito en operaciones clave☐Confirmaciones visuales y por correo de cambios importantes☐Redirección automática tras login/registro☐Opción de cerrar sesión en todos los dispositivos☐Opción de eliminar cuenta con confirmación doble☐

⚖️ Cumplimiento Legal y Ético
AspectoCumplePolítica de privacidad y términos visibles en el registro☐Consentimiento informado para tratamiento de datos personales☐Registro de consentimientos otorgados☐

📋 Gestión del Proyecto
AspectoCumpleLos integrantes del proyecto demuestran conocimiento técnico en frontend, backend y base de datos☐Los integrantes del proyecto asisten a las sesiones de seguimiento☐El proyecto es de autoría de los aprendices☐Se utiliza Git para control de versiones☐Se utiliza herramienta de planificación (Trello, GitHub Projects, Jira simple)☐Los integrantes del equipo de proyecto mantienen comunicación y compromiso durante el desarrollo☐

📝 Notas

SI: Cumple con el aspecto
NO: No cumple con el aspecto
Parcial: Cumple parcialmente (especificar en observaciones)


🎯 Resumen de Cumplimiento

Base de Datos: ___ / 6
Frontend: ___ / 15
Backend: ___ / 8
Seguridad: ___ / 13
Experiencia de Usuario: ___ / 5
Cumplimiento Legal: ___ / 3
Gestión del Proyecto: ___ / 6

Total: ___ / 56

Documento elaborado para el seguimiento del proyecto formativo SENA - ADSO