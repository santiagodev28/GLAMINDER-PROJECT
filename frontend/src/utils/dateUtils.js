/**
 * Utilidades para manejo de fechas en zona horaria de Colombia
 * Colombia está en UTC-5 (COT - Colombia Time)
 */

// Zona horaria de Colombia
export const COLOMBIA_TIMEZONE = "America/Bogota";

/**
 * Obtiene la fecha actual en zona horaria de Colombia
 * @returns {Date} Fecha actual en Colombia
 */
export const getColombiaDate = () => {
  const now = new Date();
  // Obtener la fecha en Colombia usando Intl.DateTimeFormat
  const colombiaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = colombiaDate.find((part) => part.type === "year").value;
  const month = colombiaDate.find((part) => part.type === "month").value;
  const day = colombiaDate.find((part) => part.type === "day").value;

  return new Date(`${year}-${month}-${day}T00:00:00`);
};

/**
 * Formatea una fecha en formato YYYY-MM-DD para Colombia
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const formatDateForColombia = (date) => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/**
 * Formatea una fecha para mostrar en la interfaz con zona horaria de Colombia
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @param {object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
export const formatDateForDisplay = (dateString, options = {}) => {
  if (!dateString) return "";

  const defaultOptions = {
    timeZone: COLOMBIA_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Date(dateString + "T00:00:00-05:00").toLocaleDateString(
    "es-CO",
    defaultOptions
  );
};

/**
 * Formatea una fecha corta para mostrar en la interfaz
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada corta
 */
export const formatDateShort = (dateString) => {
  return formatDateForDisplay(dateString, {
    month: "short",
    day: "numeric",
  });
};

/**
 * Obtiene el nombre del día de la semana en español
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Nombre del día
 */
export const getDayName = (dateString) => {
  return formatDateForDisplay(dateString, {
    weekday: "short",
  });
};

/**
 * Obtiene la fecha mínima para agendamiento (mañana en Colombia)
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const getMinAppointmentDate = () => {
  // Permitir agendar desde hoy
  const today = getColombiaDate();
  return formatDateForColombia(today);
};

/**
 * Obtiene la fecha máxima para agendamiento (30 días desde mañana en Colombia)
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const getMaxAppointmentDate = () => {
  const today = getColombiaDate();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);
  return formatDateForColombia(maxDate);
};

/**
 * Genera un array de días disponibles para agendamiento
 * @param {number} daysCount - Número de días a generar (default: 14)
 * @returns {Array} Array de objetos con información de días
 */
export const generateAvailableDays = (daysCount = 14) => {
  const days = [];
  const today = getColombiaDate();
  const todayString = formatDateForColombia(today);

  // Empezar desde hoy (permitir agendar para hoy)
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = formatDateForColombia(date);

    // Usar zona horaria de Colombia para mostrar nombres correctos
    const displayDate = new Date(dateString + "T00:00:00-05:00");

    days.push({
      date: dateString,
      day: displayDate.getDate(),
      month: displayDate.toLocaleDateString("es-CO", {
        month: "short",
        timeZone: COLOMBIA_TIMEZONE,
      }),
      dayName: displayDate.toLocaleDateString("es-CO", {
        weekday: "short",
        timeZone: COLOMBIA_TIMEZONE,
      }),
      isToday: dateString === todayString,
    });
  }

  return days;
};
