import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import appointmentService from "../../../../services/appointmentService";
import AdminService from "../../../../services/adminService";
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
  const [success, setSuccess] = useState("");
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

  // Cargar horarios cuando cambie empleado o fecha
  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      loadSchedules();
    }
  }, [selectedEmployee, selectedDate]);

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
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);

      const schedulesData = await appointmentService.getAvailableSchedules(
        selectedEmployee.empleado_id,
        selectedDate
      );
      setSchedules(schedulesData);
      setStep(4);
    } catch (error) {
      console.error("Error cargando horarios:", error);
      setError("Error al cargar los horarios disponibles");
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
      setError("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const appointmentData = {
        usuario_id: JSON.parse(localStorage.getItem("usuario")).usuario_id,
        empleado_id: selectedEmployee.empleado_id,
        tienda_id: selectedStore.tienda_id,
        servicio_id: selectedService.servicio_id,
        cita_fecha: selectedDate,
        horario_id: selectedSchedule.horario_id,
      };

      const result = await appointmentService.createAppointment(
        appointmentData
      );

      if (result.success) {
        setSuccess("¡Cita agendada exitosamente!");
        setTimeout(() => {
          navigate("/cliente/dashboard");
        }, 2000);
      } else {
        setError(result.message || "Error al agendar la cita");
      }
    } catch (error) {
      console.error("Error al crear cita:", error);
      setError(error.response?.data?.error || "Error al agendar la cita");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1 );
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30); // Máximo 30 días en adelante
    return maxDate.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center mt-6">
        <p className="text-red-600">No se encontró el negocio</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Agendar Cita
          </h1>
          <p className="text-gray-600">{business.negocio_nombre}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  step >= stepNumber ? "text-orange-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    step >= stepNumber
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {step > stepNumber ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-16 h-0.5 ${
                      step > stepNumber ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Step 1: Seleccionar Tienda */}
          {step >= 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BuildingStorefrontIcon className="w-6 h-6 mr-2 text-orange-500" />
                Selecciona una Tienda
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stores.map((store) => (
                  <div
                    key={store.tienda_id}
                    onClick={() => setSelectedStore(store)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedStore?.tienda_id === store.tienda_id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {store.tienda_nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {store.tienda_direccion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Seleccionar Servicio */}
          {step >= 2 && selectedStore && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-orange-500" />
                Selecciona un Servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.servicio_id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep(3);
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedService?.servicio_id === service.servicio_id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {service.servicio_nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {service.servicio_descripcion}
                    </p>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      ${service.servicio_precio}
                    </p>
                    <p className="text-xs text-gray-500">
                      Duración: {service.servicio_duracion} min
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Seleccionar Empleado y Fecha */}
          {step >= 3 && selectedService && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <UserIcon className="w-6 h-6 mr-2 text-orange-500" />
                Selecciona Empleado y Fecha
              </h2>

              {/* Empleados */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Empleado:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.map((employee) => (
                    <div
                      key={employee.empleado_id}
                      onClick={() => setSelectedEmployee(employee)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedEmployee?.empleado_id === employee.empleado_id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800">
                        {employee.usuario_nombre} {employee.usuario_apellido}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {employee.empleado_especialidad}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Fecha:</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Seleccionar Horario */}
          {step >= 4 && selectedEmployee && selectedDate && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <ClockIcon className="w-6 h-6 mr-2 text-orange-500" />
                Selecciona un Horario
              </h2>

              {schedules.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No hay horarios disponibles para esta fecha
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedDate("")}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Seleccionar otra fecha
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {schedules.map((schedule) => (
                    <button
                      key={schedule.horario_id}
                      type="button"
                      onClick={() => setSelectedSchedule(schedule)}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        selectedSchedule?.horario_id === schedule.horario_id
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      {schedule.horario_hora_inicio}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resumen de la cita */}
          {selectedStore &&
            selectedService &&
            selectedEmployee &&
            selectedDate &&
            selectedSchedule && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Resumen de tu cita:
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Tienda:</span>{" "}
                    {selectedStore.tienda_nombre}
                  </p>
                  <p>
                    <span className="font-medium">Servicio:</span>{" "}
                    {selectedService.servicio_nombre}
                  </p>
                  <p>
                    <span className="font-medium">Empleado:</span>{" "}
                    {selectedEmployee.usuario_nombre}{" "}
                    {selectedEmployee.usuario_apellido}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span>{" "}
                    {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Hora:</span>{" "}
                    {selectedSchedule.horario_hora_inicio}
                  </p>
                  <p>
                    <span className="font-medium">Precio:</span> $
                    {selectedService.servicio_precio}
                  </p>
                </div>
              </div>
            )}

          {/* Botones de navegación */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                if (step > 1) setStep(step - 1);
              }}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {step === 4 && selectedSchedule ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Agendando...
                  </>
                ) : (
                  "Confirmar Cita"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={
                  !selectedStore ||
                  !selectedService ||
                  !selectedEmployee ||
                  !selectedDate
                }
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;
