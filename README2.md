# 🧑‍💻 Proceso de Software Personal (PSP) – Proyecto Glaminder

Este repositorio documenta la aplicación del **Personal Software Process (PSP)** al desarrollo de **Glaminder**, un sistema de reservas para salones de belleza, barberías y centros estéticos.  
El objetivo es mejorar la planificación, la estimación, la calidad del software y la gestión personal del proceso mediante el uso de herramientas digitales.

---

## 📘 Acerca de este repositorio

Este repositorio contiene:

- Registros de tiempo (Time Tracking)
- Registro de defectos (Defect Tracking)
- Métricas del proyecto (LOC, productividad, densidad de defectos)
- Evidencias del uso de herramientas digitales
- Documentación del proceso PSP aplicado a un proyecto real
- Plan de mejora personal basado en datos

---

## 🛠️ Herramientas PSP utilizadas

### ⏱ Time Tracking
Herramientas usadas para registrar y analizar el tiempo invertido por fase del proceso:

- **Clockify**
- **Toggl Track**

Se registraron las fases PSP:
- Planificación  
- Diseño  
- Codificación  
- Compilación  
- Pruebas  
- Análisis Postmortem  

---

### 🐞 Defect Tracking
Herramientas utilizadas para registrar defectos introducidos y corregidos:

- **GitHub Issues**
- **JIRA (Scrum)**

Clasificación de defectos:
- Lógica de reservas  
- Disponibilidad de profesionales  
- UI/UX  
- Integración frontend-backend  
- Validaciones de datos  
- Base de datos  

---

### 📊 Estadísticas y análisis
Herramientas utilizadas para obtener métricas PSP:

- **Google Sheets**
- **Excel**

Métricas analizadas:
- LOC totales  
- Tiempo por fase  
- Densidad de defectos  
- Productividad (LOC/hora)  
- Diferencia entre estimado vs real  

---

## 🏗️ Aplicación del PSP al proyecto Glaminder

### **PSP0 – Línea base**
- Conteo de tamaño por módulos  
- Medición del tiempo real  
- Registro inicial de defectos  
- Generación de archivo Postmortem inicial  

### **PSP1 – Estimación y planificación**
- Estimación de tamaño (LOC) por módulo  
- Estimación del tiempo total por fase  
- Construcción del cronograma semanal  
- Registro continuo de tiempo real  

### **PSP2 – Gestión de calidad**
- Revisión manual del diseño  
- Revisión de código antes de cada integración  
- Registro detallado de defectos  
- Listas de verificación para:
  - Diseño UI  
  - Reglas de negocio  
  - Flujo de reserva  
  - Validaciones  

### **PSP2.1 – Mejora del diseño**
- Documentación de arquitectura (Backend + Frontend)  
- Refinamiento de patrones de diseño  
- Separación mejorada de responsabilidades (SRP)  
- Validación previa de componentes antes de integrar  

---

## 📐 Métricas PSP del proyecto Glaminder

| Métrica | Valor |
|--------|-------|
| Tamaño total del proyecto | ~20.000 LOC |
| Tiempo total invertido | ~325 horas |
| Defectos totales encontrados | 65 |
| Defectos corregidos | 65 |
| Productividad | **61.5 LOC/hora** |
| Densidad de defectos | **0.00325** (3.25 por cada 1000 LOC) |
| Fase con más defectos introducidos | Integración frontend-backend |
| Fase con más defectos corregidos | Pruebas funcionales |

---


## 🔍 Análisis de desempeño

### ✔ ¿Se cumplieron las estimaciones de tiempo?
Parcialmente.  
La estimación fue ~268 h, el tiempo real ~325 h (+21%).

### ✔ ¿Se cumplieron las estimaciones de tamaño?
Sí.  
El tamaño final (~20k LOC) estuvo dentro del rango previsto.

### ✔ Fases donde se introdujeron más defectos
- Integración frontend-backend  
- Lógica de reservas  
- UI/UX  

### ✔ Fases donde se detectaron más defectos
- Pruebas funcionales  
- Validaciones de disponibilidad  
- Revisión de UI  

### ✔ Técnicas más efectivas
- Programación modular  
- Revisiones de código previas  
- Pruebas manuales por escenarios críticos  
- Separación clara de responsabilidades  

---

## 🧠 Reflexión personal

### **Lo que aprendí**
- La importancia de registrar tiempo y defectos para mejorar estimaciones.  
- Cómo la modularidad reduce defectos de forma significativa.  
- Que las fases de integración requieren más tiempo del previsto.  
- El valor de un proceso disciplinado para un proyecto complejo.  

### **Errores cometidos con mayor frecuencia**
- Subestimar tiempo de UI y pruebas.  
- Integrar sin revisar en algunos casos.  
- No documentar decisiones inmediatamente.  

### **Parte más difícil del proceso**
- Mantener consistencia entre módulos de reservas, sucursales, agenda y personal.  
- Validación de horarios y disponibilidad.  

### **Qué cambiaré la próxima vez**
- Incluir pruebas automáticas desde el inicio.  
- Dividir aún más las tareas complejas.  
- Estimar con base en complejidad, no solo LOC.  

### **Aspecto que más mejoró**
- Modularidad del código.  
- Organización del trabajo.  
- Capacidad para analizar datos del proceso.  

---

## 🚀 Plan de mejora personal

| Objetivo | Acción específica | Métrica | Fecha límite |
|----------|-------------------|---------|--------------|
| Reducir defectos en integración | Implementar pruebas unitarias e integración | Defectos por módulo | Próximo proyecto |
| Mejorar estimación del tiempo | Estimar por complejidad + LOC | Diferencia estimado vs real | Próximo sprint |
| Mejorar eficiencia | Reutilizar módulos y componentes | LOC/hora | 2 meses |
| Disminuir retrabajo visual | Crear maquetas antes de programar UI | % de retrabajo | Próximo proyecto |

---

## Conclusión

La aplicación del PSP en Glaminder permitió medir el proceso personal con precisión, identificar áreas de mejora y fortalecer las habilidades de estimación, planificación y control de calidad. Las herramientas digitales potenciaron la disciplina del proceso y facilitaron la toma de decisiones basada en datos.  
Este aprendizaje será clave para futuros proyectos, permitiendo mejorar productividad, reducir defectos y entregar software de mayor calidad.


