import React, { useState, useEffect } from "react";
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import OwnerService from "../../../services/ownerService";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (ownerData) {
      loadServices();
    }
  }, [ownerData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("usuario"));
      const ownerData = await OwnerService.getOwnerByUserId(user.usuario_id);
      const businessesData = await OwnerService.getOwnerBusinesses(
        ownerData.propietario_id
      );
      const categoriesData = await OwnerService.getServiceCategories();
      setOwnerData(ownerData);
      setBusinesses(businessesData);
      setServiceCategories(categoriesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const servicesData = await OwnerService.getServicesByOwner(
        ownerData.propietario_id
      );
      setServices(servicesData);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setError("Error al cargar los servicios");
    }
  };

  const handleCreateService = async (serviceData) => {
    try {
      await OwnerService.createService(serviceData);
      setShowCreateForm(false);
      loadServices();
    } catch (error) {
      console.error("Error al crear servicio:", error);
      alert("Error al crear el servicio");
    }
  };

  const handleUpdateService = async (serviceId, serviceData) => {
    try {
      await OwnerService.updateService(serviceId, serviceData);
      setEditingService(null);
      loadServices();
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      alert("Error al actualizar el servicio");
    }
  };

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
              Gestión de Servicios
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Administra los servicios de tus negocios
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full md:w-auto bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white px-6 py-3 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.servicio_id}
            service={service}
            onEdit={setEditingService}
            onUpdate={handleUpdateService}
          />
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <WrenchScrewdriverIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
            No hay servicios registrados
          </h3>
          <p className="text-[#B0B3B8] mb-6 max-w-md mx-auto">
            Comienza agregando servicios a tus negocios
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Agregar Primer Servicio
          </button>
        </div>
      )}

      {/* Modal de creación/edición */}
      {(showCreateForm || editingService) && (
        <ServiceForm
          service={editingService}
          businesses={businesses}
          serviceCategories={serviceCategories}
          onSubmit={
            editingService
              ? (data) => handleUpdateService(editingService.servicio_id, data)
              : handleCreateService
          }
          onClose={() => {
            setShowCreateForm(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
};

const ServiceCard = ({ service, onEdit, onUpdate }) => {
  return (
    <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-[#31343A]/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-[400px] flex flex-col">
      {/* Imagen placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg">
            <WrenchScrewdriverIcon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2 group-hover:text-[#D1A04D] transition-colors duration-300">
                {service.servicio_nombre}
              </h3>
              <p className="text-[#B0B3B8] text-sm leading-relaxed line-clamp-2">
                {service.categoria?.categoria_nombre || "Sin categoría"}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                service.servicio_estado === 1
                  ? "text-green-400 bg-green-500/10 border-green-500/20"
                  : "text-red-400 bg-red-500/10 border-red-500/20"
              }`}
            >
              {service.servicio_estado === 1 ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Información del servicio */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center text-[#B0B3B8] text-sm">
              <CurrencyDollarIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="font-semibold text-[#F5F5F5]">
                ${service.servicio_precio.toLocaleString("es-CO")} COP
              </span>
            </div>
            <div className="flex items-center text-[#B0B3B8] text-sm">
              <ClockIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span>{service.servicio_duracion} minutos</span>
            </div>
            <div className="flex items-center text-[#B0B3B8] text-xs">
              <TagIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="truncate">
                {service.tienda?.tienda_nombre || "Sin tienda"}
              </span>
            </div>
            {service.servicio_descripcion && (
              <div className="text-[#B0B3B8] text-xs leading-relaxed line-clamp-2">
                {service.servicio_descripcion}
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción - Siempre en la parte inferior */}
        <div className="flex flex-col gap-3 sm:flex-row sm:space-x-2 mt-6">
          <button
            onClick={() => onEdit(service)}
            className="flex-1 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-3 px-4 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() =>
              onUpdate(service.servicio_id, {
                ...service,
                servicio_estado: service.servicio_estado === 1 ? 0 : 1,
              })
            }
            className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
              service.servicio_estado === 1
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            }`}
          >
            {service.servicio_estado === 1 ? (
              <XCircleIcon className="w-4 h-4" />
            ) : (
              <CheckCircleIcon className="w-4 h-4" />
            )}
            <span>
              {service.servicio_estado === 1 ? "Desactivar" : "Activar"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceForm = ({
  service,
  businesses,
  serviceCategories,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    tienda_id: service?.tienda_id || "",
    servicio_nombre: service?.servicio_nombre || "",
    servicio_descripcion: service?.servicio_descripcion || "",
    servicio_precio: service?.servicio_precio || "",
    servicio_duracion: service?.servicio_duracion || "",
    categoria_id: service?.categoria_id || "",
    servicio_estado: service?.servicio_estado || 1,
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
            {service ? "Editar Servicio" : "Nuevo Servicio"}
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
          {/* Información del Servicio */}
          <div className="bg-[#1F1F1F]/30 rounded-xl p-4 border border-[#31343A]/30">
            <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Información del Servicio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  name="servicio_nombre"
                  value={formData.servicio_nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="Ej: Corte de cabello"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Categoría *
                </label>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                >
                  <option value="">Seleccionar categoría</option>
                  {serviceCategories.map((category) => (
                    <option
                      key={category.categoria_id}
                      value={category.categoria_id}
                    >
                      {category.categoria_nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Descripción
                </label>
                <textarea
                  name="servicio_descripcion"
                  value={formData.servicio_descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="Descripción detallada del servicio"
                />
              </div>
            </div>
          </div>

          {/* Detalles del Servicio */}
          <div className="bg-[#1F1F1F]/30 rounded-xl p-4 border border-[#31343A]/30">
            <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Detalles del Servicio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Precio (Pesos) *
                </label>
                <input
                  type="number"
                  name="servicio_precio"
                  value={formData.servicio_precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  placeholder="Ej: 50000"
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Duración (min) *
                </label>
                <input
                  type="number"
                  name="servicio_duracion"
                  value={formData.servicio_duracion}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                  Estado
                </label>
                <select
                  name="servicio_estado"
                  value={formData.servicio_estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-[#1F1F1F]/30 rounded-xl p-4 border border-[#31343A]/30">
            <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Ubicación
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
              {service ? "Actualizar Servicio" : "Crear Servicio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceManagement;
