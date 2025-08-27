// frontend/src/utils/dateFormatter.js

/**
 * Formatea una fecha en formato string (ISO 8601) a un formato legible.
 * @param {string} dateString - La fecha en formato string (ej: "2023-10-27T08:00:00").
 * @param {object} options - Opciones de formato para Intl.DateTimeFormat.
 * @returns {string} - La fecha formateada.
 */
export const dateFormatter = (dateString, options) => {
  // Si no se proporciona una fecha, devuelve un string vacío para evitar errores.
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    // Intl.DateTimeFormat es la forma moderna en JavaScript para manejar fechas y horas
    // en diferentes idiomas y formatos.
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  } catch (error) {
    console.error("Error al formatear la fecha:", error);
    return "Fecha inválida"; // Devuelve un mensaje de error si el formato es incorrecto
  }
};