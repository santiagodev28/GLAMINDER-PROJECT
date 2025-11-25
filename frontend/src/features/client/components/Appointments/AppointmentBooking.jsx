import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import appointmentService from "../../../../services/appointmentService";
import AdminService from "../../../../services/adminService";
import TimeSlotSelector from "./TimeSlotSelector";
import {
  getMinAppointmentDate,
  getMaxAppointmentDate,
  generateAvailableDays,
  formatDateForDisplay,
} from "../../../../utils/dateUtils";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const AppointmentBooking = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [business, setBusiness] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // Estados del formulario
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, [businessId]);

  // Cargar datos cuando cambie la tienda seleccionada
  useEffect(() => {
    if (selectedStore) {
      loadStoreData();
    }
  }, [selectedStore]);

  // Cargar horarios solo cuando se entra al paso 5
  useEffect(() => {
    if (step === 5 && selectedEmployee && selectedDate && selectedService) {
      loadSchedules();
    }
    // Limpiar horarios si se regresa a paso anterior
    if (step < 5) {
      setSchedules([]);
      setSelectedSchedule(null);
    }
  }, [step, selectedEmployee, selectedDate, selectedService]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Cargar información del negocio
      const businessData = await AdminService.fetchBusinessById(businessId);
      setBusiness(businessData);

      // Cargar tiendas del negocio
      const storesData = await AdminService.fetchStoresByBusiness(businessId);
      setStores(storesData);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      setError("Error al cargar la información del negocio");
      toast.error("Error al cargar la información del negocio", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStoreData = async () => {
    try {
      setLoading(true);

      // Cargar servicios de la tienda
      const servicesData = await appointmentService.getServicesByStore(
        selectedStore.tienda_id
      );
      setServices(servicesData);

      // Cargar empleados de la tienda
      const employeesData = await appointmentService.getEmployeesByStore(
        selectedStore.tienda_id
      );
      setEmployees(employeesData);

      // Resetear selecciones
      setSelectedService(null);
      setSelectedEmployee(null);
      setSelectedDate("");
      setSelectedSchedule(null);
      setStep(2);
    } catch (error) {
      console.error("Error cargando datos de la tienda:", error);
      setError("Error al cargar los servicios y empleados");
      toast.error("Error al cargar los servicios y empleados", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      let schedulesData = await appointmentService.getAvailableSchedules(
        selectedEmployee.empleado_id,
        selectedDate,
        selectedService?.servicio_duracion || 30
      );

      // Si no hay horarios, intenta generar franjas y vuelve a consultar
      if (!schedulesData || schedulesData.length === 0) {
        await appointmentService.generateFranjasForDateRange(
          selectedEmployee.empleado_id,
          selectedDate,
          selectedDate
        );
        // Espera un momento para que el backend genere las franjas
        await new Promise((res) => setTimeout(res, 500));
        schedulesData = await appointmentService.getAvailableSchedules(
          selectedEmployee.empleado_id,
          selectedDate,
          selectedService?.servicio_duracion || 30
        );
      }

      setSchedules(schedulesData);
    } catch (error) {
      setError("Error al cargar los horarios disponibles");
      toast.error("Error al cargar los horarios disponibles", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedStore ||
      !selectedService ||
      !selectedEmployee ||
      !selectedDate ||
      !selectedSchedule
    ) {
      const errorMsg = "Por favor completa todos los campos";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Verificar que todos los campos requeridos estén presentes
      console.log("🔍 Verificando datos antes de enviar:");
      console.log("🔍 selectedStore:", selectedStore);
      console.log("🔍 selectedService:", selectedService);
      console.log("🔍 selectedEmployee:", selectedEmployee);
      console.log("🔍 selectedDate:", selectedDate);
      console.log("🔍 selectedSchedule:", selectedSchedule);
      console.log(
        "🔍 selectedSchedule.franja_id:",
        selectedSchedule?.franja_id
      );
      console.log(
        "🔍 selectedSchedule.slot_inicio:",
        selectedSchedule?.slot_inicio
      );
      console.log("🔍 selectedSchedule.slot_fin:", selectedSchedule?.slot_fin);

      const appointmentData = {
        usuario_id: JSON.parse(localStorage.getItem("usuario")).usuario_id,
        empleado_id: selectedEmployee.empleado_id,
        tienda_id: selectedStore.tienda_id,
        servicio_id: selectedService.servicio_id,
        cita_fecha: selectedDate,
        franja_id: selectedSchedule.franja_id,
        slot_inicio: selectedSchedule.slot_inicio,
        slot_fin: selectedSchedule.slot_fin,
      };

      console.log("🔍 Datos de la cita a enviar:", appointmentData);
      console.log("🔍 selectedSchedule completo:", selectedSchedule);

      // Verificar que no haya valores undefined o null
      const requiredFields = [
        "usuario_id",
        "empleado_id",
        "tienda_id",
        "servicio_id",
        "cita_fecha",
        "franja_id",
        "slot_inicio",
        "slot_fin",
      ];
      const missingFields = requiredFields.filter(
        (field) => !appointmentData[field]
      );

      if (missingFields.length > 0) {
        console.error("❌ Campos faltantes:", missingFields);
        const errorMsg = `Campos faltantes: ${missingFields.join(", ")}`;
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const result = await appointmentService.createAppointment(
        appointmentData
      );

      if (result.success) {
        toast.success("¡Cita agendada exitosamente!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            navigate("/cliente/dashboard");
          },
        });
        setTimeout(() => {
          navigate("/cliente/dashboard");
        }, 2000);
      } else {
        const errorMsg = result.message || "Error al agendar la cita";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error al crear cita:", error);
      const errorMsg =
        error.response?.data?.error || "Error al agendar la cita";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generar días disponibles para el selector visual
  const getAvailableDays = () => {
    const days = generateAvailableDays(14);

    // Agregar estado de selección
    return days.map((day) => ({
      ...day,
      isSelected: selectedDate === day.date,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12 sm:py-16 px-4 sm:px-0">
        <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <BuildingStorefrontIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
          No se encontró el negocio
        </h3>
        <p className="text-[#B0B3B8] text-sm sm:text-base">
          El negocio que buscas no está disponible
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header del Negocio */}
      <div className="backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-2">
                Agendar Cita
              </h1>
              <p className="text-[#B0B3B8] text-sm sm:text-lg">
                {business.negocio_nombre}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-black/90 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg overflow-x-auto">
        <div className="flex justify-center min-w-max sm:min-w-fit">
          <div className="flex space-x-2 sm:space-x-4">
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  step >= stepNumber ? "text-[#D1A04D]" : "text-[#B0B3B8]"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 text-xs sm:text-sm font-semibold ${
                    step >= stepNumber
                      ? "border-[#D1A04D] bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg"
                      : "border-[#31343A] bg-[#1F1F1F]/50"
                  }`}
                >
                  {step > stepNumber ? (
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 6 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 transition-all duration-300 ${
                      step > stepNumber
                        ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C]"
                        : "bg-[#31343A]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 sm:px-6 py-3 sm:py-4 rounded-xl backdrop-blur-sm flex items-start gap-3 shadow-lg">
          <ExclamationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" />
          <span className="text-xs sm:text-sm">{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-6 sm:p-8">
        {/* Paso 1: Seleccionar Tienda */}
        {step === 1 && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F5F5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <BuildingStorefrontIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D1A04D]" />
              Selecciona una Tienda
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {stores.map((store) => (
                <div
                  key={store.tienda_id}
                  onClick={() => {
                    setSelectedStore(store);
                    setStep(2);
                  }}
                  className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedStore?.tienda_id === store.tienda_id
                      ? "border-[#D1A04D] bg-gradient-to-br from-[#D1A04D]/10 to-[#B47B1C]/10 shadow-lg"
                      : "border-white/20 bg-gradient-to-br from-[#2A2419] to-[#1F1A0F] hover:border-[#D1A04D]/50 hover:from-[#3A3429] hover:to-[#2F2A1F]"
                  }`}
                >
                  <div className="flex items-center mb-2 sm:mb-3 gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                      <BuildingStorefrontIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#F5F5F5] text-sm sm:text-lg truncate">
                      {store.tienda_nombre}
                    </h3>
                  </div>
                  <p className="text-[#B0B3B8] text-xs sm:text-sm line-clamp-1 sm:line-clamp-2">
                    {store.tienda_direccion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 2: Seleccionar Servicio */}
        {step === 2 && selectedStore && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F5F5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D1A04D]" />
              Selecciona un Servicio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {services.map((service) => (
                <div
                  key={service.servicio_id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep(3);
                  }}
                  className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedService?.servicio_id === service.servicio_id
                      ? "border-[#D1A04D] bg-gradient-to-br from-[#D1A04D]/10 to-[#B47B1C]/10 shadow-lg"
                      : "border-white/20 bg-gradient-to-br from-[#2A2419] to-[#1F1A0F] hover:border-[#D1A04D]/50 hover:from-[#3A3429] hover:to-[#2F2A1F]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                    <h3 className="font-semibold text-[#F5F5F5] text-sm sm:text-lg flex-1 line-clamp-2">
                      {service.servicio_nombre}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-xl font-bold text-[#D1A04D] whitespace-nowrap">
                        ${service.servicio_precio}
                      </p>
                      <p className="text-xs text-[#B0B3B8]">
                        {service.servicio_duracion} min
                      </p>
                    </div>
                  </div>
                  <p className="text-[#B0B3B8] text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {service.servicio_descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 3: Seleccionar Empleado */}
        {step === 3 && selectedService && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F5F5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D1A04D]" />
              Selecciona un Empleado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {employees.map((employee) => (
                <div
                  key={employee.empleado_id}
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setStep(4);
                  }}
                  className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedEmployee?.empleado_id === employee.empleado_id
                      ? "border-[#D1A04D] bg-gradient-to-br from-[#D1A04D]/10 to-[#B47B1C]/10 shadow-lg"
                      : "border-white/20 bg-gradient-to-br from-[#2A2419] to-[#1F1A0F] hover:border-[#D1A04D]/50 hover:from-[#3A3429] hover:to-[#2F2A1F]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-semibold text-sm sm:text-lg">
                        {employee.usuario_nombre?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#F5F5F5] text-sm sm:text-lg truncate">
                        {employee.usuario_nombre} {employee.usuario_apellido}
                      </h4>
                      <p className="text-[#B0B3B8] text-xs sm:text-sm truncate">
                        {employee.empleado_especialidad}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 4: Seleccionar Fecha */}
        {step === 4 && selectedEmployee && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F5F5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D1A04D]" />
              Selecciona una Fecha
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-6">
              {getAvailableDays().map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedDate(day.date);
                    setStep(5);
                  }}
                  className={`
                    p-2 sm:p-3 rounded-lg text-center transition-all duration-300 hover:scale-105 border-2 text-xs sm:text-sm
                    ${
                      day.isSelected
                        ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg transform scale-105 border-[#D1A04D]"
                        : day.isToday
                        ? "bg-[#D1A04D]/20 border-[#D1A04D]/50 text-[#D1A04D] hover:bg-[#D1A04D]/30 hover:border-[#D1A04D]"
                        : "bg-gradient-to-br from-[#2A2419] to-[#1F1A0F] border-white/20 text-[#F5F5F5] hover:border-[#D1A04D]/50 hover:from-[#3A3429] hover:to-[#2F2A1F]"
                    }
                  `}
                >
                  <div className="font-bold mb-0.5 sm:mb-1">{day.day}</div>
                  <div className="opacity-75 mb-0.5 sm:mb-1 text-xs">{day.month}</div>
                  <div className="opacity-60 text-xs">{day.dayName}</div>
                </button>
              ))}
            </div>
            {/* Input de fecha como respaldo */}
            <div>
              <label className="block text-xs sm:text-sm text-[#B0B3B8] mb-2">
                O selecciona una fecha específica:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setStep(5);
                }}
                min={getMinAppointmentDate()}
                max={getMaxAppointmentDate()}
                className="w-full p-2 sm:p-3 bg-black/70 border border-white/20 rounded-lg text-[#F5F5F5] text-sm sm:text-base focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D] transition-all duration-300"
                required
              />
            </div>
          </div>
        )}

        {/* Paso 5: Seleccionar Horario */}
        {step === 5 && selectedEmployee && selectedDate && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#F5F5F5] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D1A04D]" />
              Selecciona un Horario
            </h2>

            {schedules.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#D1A04D]" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-[#F5F5F5] mb-2">
                  No hay horarios disponibles
                </h3>
                <p className="text-[#B0B3B8] text-sm sm:text-base mb-4 sm:mb-6">
                  No hay horarios disponibles para esta fecha
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate("");
                    setStep(4);
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-base"
                >
                  Seleccionar otra fecha
                </button>
              </div>
            ) : (
              <TimeSlotSelector
                schedules={schedules}
                selectedSchedule={selectedSchedule}
                onScheduleSelect={(schedule) => {
                  if (!schedule.franja_id) {
                    const errorMsg =
                      "El horario seleccionado no es válido. Intenta con otro horario.";
                    setError(errorMsg);
                    toast.error(errorMsg, {
                      position: "top-right",
                      autoClose: 3000,
                    });
                    setSelectedSchedule(null);
                    return;
                  }
                  setError("");
                  setSelectedSchedule(schedule);
                  setStep(6);
                }}
                selectedDate={selectedDate}
                employeeName={`${selectedEmployee.usuario_nombre} ${selectedEmployee.usuario_apellido}`}
              />
            )}
          </div>
        )}

        {/* Paso 6: Confirmación y resumen de la cita */}
        {step === 6 &&
          selectedStore &&
          selectedService &&
          selectedEmployee &&
          selectedDate &&
          selectedSchedule &&
          selectedSchedule.franja_id && (
            <div className="bg-gradient-to-br from-[#D1A04D]/10 to-[#B47B1C]/10 rounded-xl p-4 sm:p-6 mb-8 border border-[#D1A04D]/20">
              <h3 className="font-semibold text-[#F5F5F5] mb-4 text-base sm:text-lg flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D1A04D]" />
                Resumen de tu cita:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="space-y-2 sm:space-y-3">
                  <p className="flex justify-between">
                    <span className="font-medium text-[#B0B3B8]">Tienda:</span>
                    <span className="text-[#F5F5F5] truncate ml-2">
                      {selectedStore.tienda_nombre}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-[#B0B3B8]">Servicio:</span>
                    <span className="text-[#F5F5F5] truncate ml-2">
                      {selectedService.servicio_nombre}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-[#B0B3B8]">Empleado:</span>
                    <span className="text-[#F5F5F5] truncate ml-2">
                      {selectedEmployee.usuario_nombre}{" "}
                      {selectedEmployee.usuario_apellido}
                    </span>
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <p className="flex justify-between">
                    <span className="font-medium text-[#B0B3B8]">Fecha:</span>
                    <span className="text-[#F5F5F5] truncate ml-2">
                      {formatDateForDisplay(selectedDate)}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-[#B0B3B8]">Hora:</span>
                    <span className="text-[#F5F5F5]">
                      {selectedSchedule.slot_inicio ||
                        selectedSchedule.horario_hora_inicio}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-[#B0B3B8]">Precio:</span>
                    <span className="text-[#D1A04D] font-bold text-sm sm:text-lg">
                      ${selectedService.servicio_precio}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-4 sm:mt-6">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 text-xs sm:text-base gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Agendando...</span>
                    </>
                  ) : (
                    "Confirmar Cita"
                  )}
                </button>
              </div>
            </div>
          )}

        {/* Botones de navegación */}
        <div className="flex justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
            }}
            disabled={step === 1}
            className="px-4 sm:px-8 py-2 sm:py-4 bg-black/80 text-[#F5F5F5] rounded-xl hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 text-xs sm:text-base"
          >
            Anterior
          </button>
          {step < 6 && (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !selectedStore) {
                  toast.warning("Selecciona una tienda para continuar", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
                if (step === 2 && !selectedService) {
                  toast.warning("Selecciona un servicio para continuar", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
                if (step === 3 && !selectedEmployee) {
                  toast.warning("Selecciona un empleado para continuar", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
                if (step === 4 && !selectedDate) {
                  toast.warning("Selecciona una fecha para continuar", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
              }}
              className="hidden"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;