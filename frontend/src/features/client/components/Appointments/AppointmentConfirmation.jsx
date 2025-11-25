import { useState } from "react";
import { toast } from "react-toastify";
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
      toast.error("Debes aceptar los términos y condiciones para continuar", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header de confirmación */}
      <div className="bg-gradient-to-br from-[#23262B] to-[#181B20] backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <CheckCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-2 sm:mb-3">
            Confirma tu Cita
          </h2>
          <p className="text-[#B0B3B8] text-sm sm:text-lg">
            Revisa todos los detalles antes de confirmar
          </p>
        </div>
      </div>

      {/* Resumen de la cita */}
      <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-[#F5F5F5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D1A04D]" />
          Resumen de tu Cita
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {/* Servicio */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#F5F5F5] text-sm sm:text-lg mb-1">
                Servicio
              </h4>
              <p className="text-[#B0B3B8] text-sm sm:text-lg">
                {appointmentData.service.servicio_nombre}
              </p>
              <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1 line-clamp-2">
                {appointmentData.service.servicio_descripcion}
              </p>
            </div>
          </div>

          {/* Tienda */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <BuildingStorefrontIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#F5F5F5] text-sm sm:text-lg mb-1">
                Tienda
              </h4>
              <p className="text-[#B0B3B8] text-sm sm:text-lg truncate">
                {appointmentData.store.tienda_nombre}
              </p>
              <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1 line-clamp-2">
                {appointmentData.store.tienda_direccion}
              </p>
            </div>
          </div>

          {/* Empleado */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#F5F5F5] text-sm sm:text-lg mb-1">
                Profesional
              </h4>
              <p className="text-[#B0B3B8] text-sm sm:text-lg truncate">
                {appointmentData.employee.usuario_nombre}{" "}
                {appointmentData.employee.usuario_apellido}
              </p>
              <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1 truncate">
                {appointmentData.employee.empleado_especialidad}
              </p>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#F5F5F5] text-sm sm:text-lg mb-1">
                Fecha y Hora
              </h4>
              <p className="text-[#B0B3B8] text-sm sm:text-lg">
                {formatDate(appointmentData.date)}
              </p>
              <p className="text-xs sm:text-sm text-[#B0B3B8] mt-1">
                {formatTime(appointmentData.schedule.horario_hora_inicio)}
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/20 my-6 sm:my-8"></div>

        {/* Detalles adicionales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-lg">
          <div className="flex justify-between items-center">
            <span className="text-[#B0B3B8]">Duración:</span>
            <span className="font-medium text-[#F5F5F5]">
              {calculateDuration()} minutos
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#B0B3B8]">Precio:</span>
            <span className="font-bold text-[#D1A04D] text-lg sm:text-2xl">
              ${calculateTotalPrice()}
            </span>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/10">
        <h4 className="font-medium text-[#F5F5F5] mb-4 text-sm sm:text-lg">
          Términos y Condiciones
        </h4>

        <div className="space-y-3 sm:space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-[#D1A04D] border-white/20 rounded focus:ring-[#D1A04D]/50 bg-black/50 cursor-pointer"
            />
            <span className="text-[#B0B3B8] text-xs sm:text-sm">
              Acepto los{" "}
              <a href="#" className="text-[#D1A04D] hover:underline">
                términos y condiciones
              </a>{" "}
              del servicio
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-[#D1A04D] border-white/20 rounded focus:ring-[#D1A04D]/50 bg-black/50 cursor-pointer"
            />
            <span className="text-[#B0B3B8] text-xs sm:text-sm">
              Acepto la{" "}
              <a href="#" className="text-[#D1A04D] hover:underline">
                política de privacidad
              </a>{" "}
              y el tratamiento de mis datos
            </span>
          </label>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-[#B0B3B8] text-xs sm:text-sm">
            <p className="font-medium mb-2 sm:mb-3 text-[#F5F5F5] text-sm sm:text-lg">
              Información importante:
            </p>
            <ul className="space-y-1 sm:space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D1A04D] rounded-full flex-shrink-0"></span>
                Llega 10 minutos antes de tu cita
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D1A04D] rounded-full flex-shrink-0"></span>
                Puedes cancelar hasta 24 horas antes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D1A04D] rounded-full flex-shrink-0"></span>
                Trae identificación válida
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D1A04D] rounded-full flex-shrink-0"></span>
                El pago se realiza en la tienda
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-black/80 text-[#F5F5F5] rounded-xl hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base"
        >
          Volver
        </button>

        <button
          type="submit"
          disabled={!termsAccepted || !privacyAccepted || isSubmitting}
          className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 h-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
              Confirmando...
            </>
          ) : (
            "Confirmar Cita"
          )}
        </button>
      </form>
    </div>
  );
};

export default AppointmentConfirmation;