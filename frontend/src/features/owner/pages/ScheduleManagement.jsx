import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import OwnerService from "../../../services/ownerService";

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const daysOfWeek = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 7, label: "Domingo" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Obtener datos del propietario
      const user = JSON.parse(localStorage.getItem("usuario"));

      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      const ownerResponse = await OwnerService.getOwnerByUserId(
        user.usuario_id
      );
      setOwnerData(ownerResponse);

      // Obtener negocios del propietario
      const businessesData = await OwnerService.getOwnerBusinesses(
        ownerResponse.propietario_id
      );

      // Obtener todas las tiendas y empleados
      const allEmployees = [];
      const allStores = [];

      for (const business of businessesData) {
        const businessStores = await OwnerService.getStoresByBusiness(
          business.negocio_id
        );
        allStores.push(...businessStores);

        for (const store of businessStores) {
          const storeEmployees = await OwnerService.getEmployeesByStore(
            store.tienda_id
          );
          allEmployees.push(...storeEmployees);
        }
      }

      setEmployees(allEmployees);
      setStores(allStores);

      // Cargar horarios
      await loadSchedules(ownerResponse.propietario_id);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async (propietario_id) => {
    try {
      const schedulesData = await OwnerService.getSchedulesByOwner(
        propietario_id
      );
      setSchedules(schedulesData);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
      setError("Error al cargar los horarios");
    }
  };

  const handleCreateSchedule = async (scheduleData) => {
    try {
      await OwnerService.createSchedule(scheduleData);
      setShowCreateForm(false);
      await loadSchedules(ownerData.propietario_id);
    } catch (error) {
      console.error("Error al crear horario:", error);
      alert("Error al crear el horario");
    }
  };

  const handleUpdateSchedule = async (horario_id, scheduleData) => {
    try {
      await OwnerService.updateSchedule(horario_id, scheduleData);
      setEditingSchedule(null);
      await loadSchedules(ownerData.propietario_id);
    } catch (error) {
      console.error("Error al actualizar horario:", error);
      alert("Error al actualizar el horario");
    }
  };

  const handleDeleteSchedule = async (horario_id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este horario?")) {
      try {
        await OwnerService.deleteSchedule(horario_id);
        await loadSchedules(ownerData.propietario_id);
      } catch (error) {
        console.error("Error al eliminar horario:", error);
        alert("Error al eliminar el horario");
      }
    }
  };

  const getDayColor = (day) => {
    const colors = {
      lunes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      martes: "bg-green-500/10 text-green-400 border-green-500/20",
      miércoles: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      jueves: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      viernes: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      sábado: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      domingo: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[day] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircleIcon className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">Error</h3>
        <p className="text-[#B0B3B8]">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
            Gestión de Horarios
          </h1>
          <p className="text-[#B0B3B8]">
            Administra los horarios de trabajo de tus empleados
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full md:w-auto bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Horario</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#B0B3B8] text-sm">Total Horarios</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {schedules.length}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-[#D1A04D] flex-shrink-0" />
          </div>
        </div>
        <div className="bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#B0B3B8] text-sm">Empleados Activos</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {employees.length}
              </p>
            </div>
            <UserIcon className="w-8 h-8 text-[#D1A04D] flex-shrink-0" />
          </div>
        </div>
        <div className="bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#B0B3B8] text-sm">Tiendas</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {stores.length}
              </p>
            </div>
            <BuildingStorefrontIcon className="w-8 h-8 text-[#D1A04D] flex-shrink-0" />
          </div>
        </div>
        <div className="bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#B0B3B8] text-sm">Horarios Activos</p>
              <p className="text-2xl font-bold text-[#F5F5F5]">
                {schedules.filter((s) => s.horario_activo).length}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-[#D1A04D] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Lista de horarios */}
      <div className="bg-[#1F1F1F]/30 backdrop-blur-sm border border-[#31343A]/30 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[#F5F5F5] mb-6">
          Horarios de Empleados
        </h2>

        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ClockIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
              No hay horarios registrados
            </h3>
            <p className="text-[#B0B3B8] mb-6">
              Comienza creando horarios para tus empleados
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Crear Primer Horario</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.horario_id}
                schedule={schedule}
                onEdit={setEditingSchedule}
                onDelete={handleDeleteSchedule}
                getDayColor={getDayColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Formulario de creación/edición */}
      {(showCreateForm || editingSchedule) && (
        <ScheduleForm
          schedule={editingSchedule}
          employees={employees}
          stores={stores}
          daysOfWeek={daysOfWeek}
          onSubmit={
            editingSchedule
              ? (data) => handleUpdateSchedule(editingSchedule.horario_id, data)
              : handleCreateSchedule
          }
          onClose={() => {
            setShowCreateForm(false);
            setEditingSchedule(null);
          }}
        />
      )}
    </div>
  );
};

// Componente para mostrar cada horario
const ScheduleCard = ({ schedule, onEdit, onDelete, getDayColor }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDays = (days) => {
    if (!days || days.length === 0) return "Sin días";
    const dayNames = {
      1: "Lun",
      2: "Mar",
      3: "Mié",
      4: "Jue",
      5: "Vie",
      6: "Sáb",
      7: "Dom",
    };
    return days.map((day) => dayNames[day]).join(", ");
  };

  const formatDate = (date) => {
    if (!date) return "Indefinido";
    return new Date(date).toLocaleDateString("es-CO");
  };

  return (
    <div className="bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl p-6 hover:border-[#D1A04D]/30 transition-all duration-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                schedule.horario_tipo_semanal === "semanal"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-purple-500/10 text-purple-400 border-purple-500/20"
              }`}
            >
              {schedule.horario_tipo_semanal === "semanal"
                ? "Semanal"
                : "Específico"}
            </span>
            {schedule.horario_nombre && (
              <span className="text-[#D1A04D] font-semibold">
                {schedule.horario_nombre}
              </span>
            )}
            <span className="text-[#F5F5F5] font-semibold">
              {schedule.usuario_nombre} {schedule.usuario_apellido}
            </span>
            <span className="text-[#B0B3B8] text-sm">
              {schedule.tienda_nombre}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-4 text-[#B0B3B8]">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#D1A04D]" />
                <span>
                  {formatTime(schedule.horario_inicio)} -{" "}
                  {formatTime(schedule.horario_fin)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    schedule.horario_activo
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {schedule.horario_activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {schedule.horario_tipo_semanal === "semanal" ? (
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#B0B3B8]">
                <div className="flex items-center gap-2">
                  <span className="text-[#D1A04D]">Días:</span>
                  <span>{formatDays(schedule.dias_trabajo)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D1A04D]">Desde:</span>
                  <span>{formatDate(schedule.fecha_inicio)}</span>
                </div>
                {schedule.fecha_fin && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#D1A04D]">Hasta:</span>
                    <span>{formatDate(schedule.fecha_fin)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#B0B3B8]">
                <div className="flex items-center gap-2">
                  <span className="text-[#D1A04D]">Fecha:</span>
                  <span>{formatDate(schedule.horario_dia)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => onEdit(schedule)}
            className="p-2 bg-[#D1A04D]/10 text-[#D1A04D] rounded-lg hover:bg-[#D1A04D]/20 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(schedule.horario_id)}
            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Formulario para crear/editar horarios
const ScheduleForm = ({
  schedule,
  employees,
  stores,
  daysOfWeek,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    empleado_id: schedule?.empleado_id || "",
    tienda_id: schedule?.tienda_id || "",
    horario_tipo_semanal: schedule?.horario_tipo_semanal || "semanal",
    dias_trabajo: schedule?.dias_trabajo || [],
    dias_descanso: schedule?.dias_descanso || [],
    fecha_inicio: schedule?.fecha_inicio || "",
    fecha_fin: schedule?.fecha_fin || "",
    horario_nombre: schedule?.horario_nombre || "",
    horario_dia: schedule?.horario_dia || "",
    horario_inicio: schedule?.horario_inicio || "",
    horario_fin: schedule?.horario_fin || "",
    horario_activo:
      schedule?.horario_activo !== undefined ? schedule.horario_activo : true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDayChange = (dayValue, isChecked) => {
    const dayNum = dayValue; // Ya es un número
    let newWorkDays = [...formData.dias_trabajo];

    if (isChecked) {
      // Agregar a días de trabajo si no está ya
      if (!newWorkDays.includes(dayNum)) {
        newWorkDays.push(dayNum);
      }
    } else {
      // Remover de días de trabajo
      newWorkDays = newWorkDays.filter((d) => d !== dayNum);
    }

    // Calcular días de descanso automáticamente
    const allDays = [1, 2, 3, 4, 5, 6, 7];
    const newRestDays = allDays.filter((day) => !newWorkDays.includes(day));

    setFormData({
      ...formData,
      dias_trabajo: newWorkDays,
      dias_descanso: newRestDays,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F1F1F] border border-[#31343A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 border-b border-[#31343A]">
          <h2 className="text-xl font-semibold text-[#F5F5F5]">
            {schedule ? "Editar Horario" : "Nuevo Horario"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#31343A] rounded-lg transition-colors"
          >
            <XCircleIcon className="w-6 h-6 text-[#B0B3B8]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de horario */}
          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-4">
              Tipo de Horario *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.horario_tipo_semanal === "semanal"
                    ? "bg-gradient-to-br from-[#D1A04D]/10 to-[#B47B1C]/10 border-[#D1A04D] text-[#D1A04D]"
                    : "bg-[#1F1F1F]/30 border-[#31343A] text-[#B0B3B8] hover:border-[#D1A04D]/50 hover:bg-[#D1A04D]/5"
                }`}
              >
                <input
                  type="radio"
                  name="horario_tipo_semanal"
                  value="semanal"
                  checked={formData.horario_tipo_semanal === "semanal"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                    formData.horario_tipo_semanal === "semanal"
                      ? "border-[#D1A04D] bg-[#D1A04D]"
                      : "border-[#31343A] bg-[#1F1F1F]"
                  }`}
                >
                  {formData.horario_tipo_semanal === "semanal" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium">Horario Semanal</div>
                  <div className="text-xs opacity-75">
                    Se repite cada semana
                  </div>
                </div>
              </label>

              <label
                className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.horario_tipo_semanal === "especifico"
                    ? "bg-gradient-to-br from-[#D1A04D]/10 to-[#B47B1C]/10 border-[#D1A04D] text-[#D1A04D]"
                    : "bg-[#1F1F1F]/30 border-[#31343A] text-[#B0B3B8] hover:border-[#D1A04D]/50 hover:bg-[#D1A04D]/5"
                }`}
              >
                <input
                  type="radio"
                  name="horario_tipo_semanal"
                  value="especifico"
                  checked={formData.horario_tipo_semanal === "especifico"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                    formData.horario_tipo_semanal === "especifico"
                      ? "border-[#D1A04D] bg-[#D1A04D]"
                      : "border-[#31343A] bg-[#1F1F1F]"
                  }`}
                >
                  {formData.horario_tipo_semanal === "especifico" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium">Horario Específico</div>
                  <div className="text-xs opacity-75">
                    Para una fecha particular
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Empleado *
              </label>
              <select
                name="empleado_id"
                value={formData.empleado_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              >
                <option value="">Seleccionar empleado</option>
                {employees.map((employee) => (
                  <option
                    key={employee.empleado_id}
                    value={employee.empleado_id}
                  >
                    {employee.usuario?.usuario_nombre}{" "}
                    {employee.usuario?.usuario_apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Tienda *
              </label>
              <select
                name="tienda_id"
                value={formData.tienda_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              >
                <option value="">Seleccionar tienda</option>
                {stores.map((store) => (
                  <option key={store.tienda_id} value={store.tienda_id}>
                    {store.tienda_nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre del horario (solo para horarios semanales) */}
            {formData.horario_tipo_semanal === "semanal" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Nombre del Horario *
                </label>
                <input
                  type="text"
                  name="horario_nombre"
                  value={formData.horario_nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Horario Matutino, Horario Vespertino"
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] placeholder-[#B0B3B8] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                />
              </div>
            )}

            {/* Días de trabajo (solo para horarios semanales) */}
            {formData.horario_tipo_semanal === "semanal" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#B0B3B8] mb-4">
                  Días de Trabajo *
                </label>
                <div className="grid grid-cols-7 gap-3">
                  {daysOfWeek.map((day) => {
                    const isSelected = formData.dias_trabajo.includes(
                      day.value
                    );
                    return (
                      <div key={day.value} className="text-center">
                        <label className="block text-xs text-[#B0B3B8] mb-2 font-medium">
                          {day.label.slice(0, 3)}
                        </label>
                        <div
                          className={`w-12 h-12 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                            isSelected
                              ? "bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] border-[#D1A04D] text-white shadow-lg transform scale-105"
                              : "bg-[#1F1F1F]/50 border-[#31343A] text-[#B0B3B8] hover:border-[#D1A04D]/50 hover:bg-[#D1A04D]/10"
                          }`}
                          onClick={() =>
                            handleDayChange(day.value, !isSelected)
                          }
                        >
                          {isSelected ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span className="text-lg font-semibold">
                              {day.value}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-[#1F1F1F]/30 rounded-lg border border-[#31343A]/30">
                  <p className="text-xs text-[#B0B3B8] text-center">
                    💡 Selecciona los días que el empleado trabajará. Los días
                    no seleccionados serán automáticamente días de descanso.
                  </p>
                </div>
              </div>
            )}

            {/* Día específico (solo para horarios específicos) */}
            {formData.horario_tipo_semanal === "especifico" && (
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Día Específico *
                </label>
                <input
                  type="date"
                  name="horario_dia"
                  value={formData.horario_dia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                />
              </div>
            )}

            {/* Fechas de vigencia */}
            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Fecha de Fin (Opcional)
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-3">
                Estado del Horario
              </label>
              <label
                className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.horario_activo
                    ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/50 text-green-400"
                    : "bg-[#1F1F1F]/30 border-[#31343A] text-[#B0B3B8] hover:border-green-500/30 hover:bg-green-500/5"
                }`}
              >
                <input
                  type="checkbox"
                  name="horario_activo"
                  checked={formData.horario_activo}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                    formData.horario_activo
                      ? "border-green-500 bg-green-500"
                      : "border-[#31343A] bg-[#1F1F1F]"
                  }`}
                >
                  {formData.horario_activo && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {formData.horario_activo
                      ? "Horario Activo"
                      : "Horario Inactivo"}
                  </div>
                  <div className="text-xs opacity-75">
                    {formData.horario_activo
                      ? "El horario está disponible para citas"
                      : "El horario no está disponible"}
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Hora de Inicio *
              </label>
              <input
                type="time"
                name="horario_inicio"
                value={formData.horario_inicio}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Hora de Fin *
              </label>
              <input
                type="time"
                name="horario_fin"
                value={formData.horario_fin}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 sm:flex-row">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {schedule ? "Actualizar Horario" : "Crear Horario"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-3 border border-[#31343A] text-[#B0B3B8] rounded-xl hover:bg-[#31343A] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleManagement;
