import { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const AppointmentConfirmation = ({
  appointmentData,
  onConfirm,
  onBack,
  isSubmitting,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!termsAccepted || !privacyAccepted) {
      return;
    }

    onConfirm();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = () => {
    // Calcular duración total si hay múltiples servicios
    return appointmentData.service.servicio_duracion || 60;
  };

  const calculateTotalPrice = () => {
    // Calcular precio total si hay múltiples servicios
    return appointmentData.service.servicio_precio || 0;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header de confirmación */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirma tu Cita
        </h2>
        <p className="text-gray-600">
          Revisa todos los detalles antes de confirmar
        </p>
      </div>

      {/* Resumen de la cita */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
          Resumen de tu Cita
        </h3>

        <div className="space-y-4">
          {/* Servicio */}
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Servicio</h4>
              <p className="text-gray-600">
                {appointmentData.service.servicio_nombre}
              </p>
              <p className="text-sm text-gray-500">
                {appointmentData.service.servicio_descripcion}
              </p>
            </div>
          </div>

          {/* Tienda */}
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BuildingStorefrontIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Tienda</h4>
              <p className="text-gray-600">
                {appointmentData.store.tienda_nombre}
              </p>
              <p className="text-sm text-gray-500">
                {appointmentData.store.tienda_direccion}
              </p>
            </div>
          </div>

          {/* Empleado */}
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Profesional</h4>
              <p className="text-gray-600">
                {appointmentData.employee.usuario_nombre}{" "}
                {appointmentData.employee.usuario_apellido}
              </p>
              <p className="text-sm text-gray-500">
                {appointmentData.employee.empleado_especialidad}
              </p>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Fecha y Hora</h4>
              <p className="text-gray-600">
                {formatDate(appointmentData.date)}
              </p>
              <p className="text-sm text-gray-500">
                {formatTime(appointmentData.schedule.horario_hora_inicio)}
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Detalles adicionales */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Duración:</span>
            <span className="ml-2 font-medium text-gray-800">
              {calculateDuration()} minutos
            </span>
          </div>
          <div>
            <span className="text-gray-500">Precio:</span>
            <span className="ml-2 font-bold text-orange-600 text-lg">
              ${calculateTotalPrice()}
            </span>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-800 mb-3">
          Términos y Condiciones
        </h4>

        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Acepto los{" "}
              <a href="#" className="text-orange-600 hover:underline">
                términos y condiciones
              </a>{" "}
              del servicio
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Acepto la{" "}
              <a href="#" className="text-orange-600 hover:underline">
                política de privacidad
              </a>{" "}
              y el tratamiento de mis datos
            </span>
          </label>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <ul className="space-y-1">
              <li>• Llega 10 minutos antes de tu cita</li>
              <li>• Puedes cancelar hasta 24 horas antes</li>
              <li>• Trae identificación válida</li>
              <li>• El pago se realiza en la tienda</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volver
        </button>

        <button
          type="submit"
          disabled={!termsAccepted || !privacyAccepted || isSubmitting}
          className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Confirmando...
            </>
          ) : (
            "Confirmar Cita"
          )}
        </button>
      </form>

      {/* Mensaje de error si no se aceptan los términos */}
      {(!termsAccepted || !privacyAccepted) && (
        <p className="text-sm text-red-600 text-center mt-3">
          Debes aceptar los términos y condiciones para continuar
        </p>
      )}
    </div>
  );
};

export default AppointmentConfirmation;
