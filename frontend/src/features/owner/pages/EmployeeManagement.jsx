import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import OwnerService from "../../../services/ownerService";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("usuario"));
      const ownerData = await OwnerService.getOwnerByUserId(user.usuario_id);
      const businessesData = await OwnerService.getOwnerBusinesses(
        ownerData.propietario_id
      );
      setBusinesses(businessesData);

      // Cargar empleados de todos los negocios
      const allEmployees = [];
      for (const business of businessesData) {
        const stores = await OwnerService.getStoresByBusiness(
          business.negocio_id
        );
        for (const store of stores) {
          const storeEmployees = await OwnerService.getEmployeesByStore(
            store.tienda_id
          );
          allEmployees.push(...storeEmployees);
        }
      }
      setEmployees(allEmployees);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      await OwnerService.createCompleteEmployee(employeeData);
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      console.error("Error al crear empleado:", error);
      alert(
        "Error al crear el empleado: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleUpdateEmployee = async (employeeId, employeeData) => {
    try {
      await OwnerService.updateEmployee(employeeId, employeeData);
      setEditingEmployee(null);
      loadData();
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      alert("Error al actualizar el empleado");
    }
  };

  const handleChangeEmployeeState = async (employeeId, newState) => {
    try {
      await OwnerService.changeEmployeeState(employeeId, newState);
      loadData();
    } catch (error) {
      console.error("Error al cambiar estado del empleado:", error);
      alert("Error al cambiar el estado del empleado");
    }
  };

  const filteredEmployees = selectedBusiness
    ? employees.filter(
        (emp) => emp.tienda?.negocio_id === parseInt(selectedBusiness)
      )
    : employees;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-6 sm:p-6">
      {/* Header del Dashboard */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              Gestión de Empleados
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Administra el personal de tus negocios
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#23262B]/80 backdrop-blur-md rounded-xl p-6 border border-[#31343A]/50 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-medium text-[#B0B3B8]">
            Filtrar por negocio:
          </label>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
          >
            <option value="">Todos los negocios</option>
            {businesses.map((business) => (
              <option key={business.negocio_id} value={business.negocio_id}>
                {business.negocio_nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de empleados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.empleado_id}
            employee={employee}
            onEdit={setEditingEmployee}
            onUpdate={handleUpdateEmployee}
            onChangeState={handleChangeEmployeeState}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserGroupIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
            {selectedBusiness
              ? "No hay empleados en este negocio"
              : "No tienes empleados registrados"}
          </h3>
          <p className="text-[#B0B3B8] mb-6 max-w-md mx-auto">
            {selectedBusiness
              ? "Intenta con otro negocio o agrega empleados"
              : "Comienza agregando tu primer empleado"}
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Agregar Empleado
          </button>
        </div>
      )}

      {/* Modal de creación/edición */}
      {(showCreateForm || editingEmployee) && (
        <EmployeeForm
          employee={editingEmployee}
          businesses={businesses}
          onSubmit={
            editingEmployee
              ? (data) =>
                  handleUpdateEmployee(editingEmployee.empleado_id, data)
              : handleCreateEmployee
          }
          onClose={() => {
            setShowCreateForm(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

const EmployeeCard = ({ employee, onEdit, onUpdate, onChangeState }) => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const employeeStats = await OwnerService.getEmployeeStats(
        employee.empleado_id
      );
      setStats(employeeStats);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [employee.empleado_id]);

  return (
    <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-[#31343A]/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-[500px] flex flex-col">
      {/* Imagen placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        {/* Overlay para efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#23262B]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2 group-hover:text-[#D1A04D] transition-colors duration-300">
                {employee.usuario?.usuario_nombre || "Sin nombre"}
              </h3>
              <p className="text-[#B0B3B8] text-sm leading-relaxed line-clamp-2">
                {employee.empleado_especialidad || "Especialista en belleza"}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                employee.empleado_estado === 1
                  ? "text-green-400 bg-green-500/10 border-green-500/20"
                  : "text-red-400 bg-red-500/10 border-red-500/20"
              }`}
            >
              {employee.empleado_estado === 1 ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Información de contacto */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center text-[#B0B3B8] text-sm">
              <EnvelopeIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="truncate">
                {employee.usuario?.usuario_correo || "Sin email"}
              </span>
            </div>
            <div className="flex items-center text-[#B0B3B8] text-sm">
              <PhoneIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="truncate">
                {employee.usuario?.usuario_telefono || "Sin teléfono"}
              </span>
            </div>
            <div className="flex items-center text-[#B0B3B8] text-xs">
              <BuildingStorefrontIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="truncate">
                {employee.tienda?.tienda_nombre || "Sin tienda"}
              </span>
            </div>
          </div>

          {loadingStats ? (
            <div className="animate-pulse mt-4">
              <div className="h-4 bg-[#31343A] rounded mb-2"></div>
              <div className="h-4 bg-[#31343A] rounded"></div>
            </div>
          ) : (
            stats && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#D1A04D]">
                    {stats.totalAppointments || 0}
                  </p>
                  <p className="text-xs text-[#B0B3B8]">Citas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#D1A04D]">
                    {stats.completedAppointments || 0}
                  </p>
                  <p className="text-xs text-[#B0B3B8]">Completadas</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Botones de acción - Siempre en la parte inferior */}
        <div className="flex flex-col gap-3 sm:flex-row sm:space-x-2 mt-6">
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-3 px-4 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() =>
              onChangeState(
                employee.empleado_id,
                employee.empleado_estado === 1 ? 0 : 1
              )
            }
            className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
              employee.empleado_estado === 1
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            }`}
          >
            <span>
              {employee.empleado_estado === 1 ? "Desactivar" : "Activar"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeForm = ({ employee, businesses, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    // Datos del usuario (solo para creación)
    usuario_nombre: employee?.usuario?.usuario_nombre || "",
    usuario_apellido: employee?.usuario?.usuario_apellido || "",
    usuario_correo: employee?.usuario?.usuario_correo || "",
    usuario_telefono: employee?.usuario?.usuario_telefono || "",
    usuario_contrasena: "",
    // Datos del empleado
    tienda_id: employee?.tienda_id || "",
    empleado_especialidad: employee?.empleado_especialidad || "",
    empleado_estado: employee?.empleado_estado || 1,
  });
  const [stores, setStores] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");

  useEffect(() => {
    if (selectedBusiness) {
      loadStores();
    }
  }, [selectedBusiness]);

  const loadStores = async () => {
    if (selectedBusiness) {
      try {
        const businessStores = await OwnerService.getStoresByBusiness(
          parseInt(selectedBusiness)
        );
        setStores(businessStores);
      } catch (error) {
        console.error("Error al cargar tiendas:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-2xl mx-4 border border-[#31343A]/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#F5F5F5]">
            {employee ? "Editar Empleado" : "Nuevo Empleado"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#B0B3B8] hover:text-[#F5F5F5] transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="bg-[#1F1F1F]/30 rounded-xl p-4 border border-[#31343A]/30">
            <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="usuario_nombre"
                  value={formData.usuario_nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="Nombre del empleado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="usuario_apellido"
                  value={formData.usuario_apellido}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="Apellido del empleado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="usuario_correo"
                  value={formData.usuario_correo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="usuario_telefono"
                  value={formData.usuario_telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="312 345 6789"
                />
              </div>
              {!employee && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                    Contraseña Temporal *
                  </label>
                  <input
                    type="password"
                    name="usuario_contrasena"
                    value={formData.usuario_contrasena}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                    placeholder="Contraseña temporal (el empleado podrá cambiarla)"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Información Laboral */}
          <div className="bg-[#1F1F1F]/30 rounded-xl p-4 border border-[#31343A]/30">
            <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Información Laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Negocio *
                </label>
                <select
                  value={selectedBusiness}
                  onChange={(e) => {
                    setSelectedBusiness(e.target.value);
                    setFormData({ ...formData, tienda_id: "" });
                  }}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                >
                  <option value="">Seleccionar negocio</option>
                  {businesses.map((business) => (
                    <option
                      key={business.negocio_id}
                      value={business.negocio_id}
                    >
                      {business.negocio_nombre}
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
                  disabled={!selectedBusiness}
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300 disabled:opacity-50"
                >
                  <option value="">Seleccionar tienda</option>
                  {stores.map((store) => (
                    <option key={store.tienda_id} value={store.tienda_id}>
                      {store.tienda_nombre} - {store.tienda_ciudad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Especialidad *
                </label>
                <input
                  type="text"
                  name="empleado_especialidad"
                  value={formData.empleado_especialidad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="Ej: Corte de cabello, Manicure, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Estado
                </label>
                <select
                  name="empleado_estado"
                  value={formData.empleado_estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#31343A] text-[#B0B3B8] py-3 px-6 rounded-xl hover:bg-[#3A3F47] hover:text-[#F5F5F5] transition-all duration-300 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white py-3 px-6 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {employee ? "Actualizar Empleado" : "Crear Empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeManagement;
