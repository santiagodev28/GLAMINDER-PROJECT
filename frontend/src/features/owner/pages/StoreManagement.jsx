import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BuildingStorefrontIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import OwnerService from "../../../services/ownerService";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("usuario"));
      const ownerData = await OwnerService.getOwnerByUserId(user.usuario_id);

      // Cargar negocios del propietario
      const businessesData = await OwnerService.getOwnerBusinesses(
        ownerData.propietario_id,
        true
      );
      setBusinesses(businessesData);

      // Cargar categorías de tienda
      const categoriesData = await OwnerService.getStoreCategories();
      setCategories(categoriesData);

      // Cargar todas las tiendas de todos los negocios
      const allStores = [];
      for (const business of businessesData) {
        const businessStores = await OwnerService.getStoresByBusiness(
          business.negocio_id
        );
        allStores.push(...businessStores);
      }
      setStores(allStores);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (storeData) => {
    try {
      await OwnerService.createStore(storeData);
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      console.error("Error al crear tienda:", error);
      alert("Error al crear la tienda");
    }
  };

  const handleUpdateStore = async (storeId, storeData) => {
    try {
      await OwnerService.updateStore(storeId, storeData);
      setEditingStore(null);
      loadData();
    } catch (error) {
      console.error("Error al actualizar tienda:", error);
      alert("Error al actualizar la tienda");
    }
  };

  // Ya no necesitamos filtrado, mostramos todas las tiendas del propietario

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D1A04D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header del Dashboard */}
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-8 border border-[#31343A]/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              Gestión de Tiendas
            </h1>
            <p className="text-[#B0B3B8] text-lg">
              Administra las tiendas de tus negocios
            </p>
          </div>
        </div>
      </div>

      {/* Lista de tiendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard
            key={store.tienda_id}
            store={store}
            onEdit={setEditingStore}
            onUpdate={handleUpdateStore}
          />
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BuildingStorefrontIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
            No tienes tiendas registradas
          </h3>
          <p className="text-[#B0B3B8] mb-6 max-w-md mx-auto">
            ¡Crea tu primera tienda y comienza a ofrecer servicios!
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white rounded-lg hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Primera Tienda
          </button>
        </div>
      )}

      {/* Modal de creación/edición */}
      {(showCreateForm || editingStore) && (
        <StoreForm
          store={editingStore}
          businesses={businesses}
          categories={categories}
          onSubmit={
            editingStore
              ? (data) => handleUpdateStore(editingStore.tienda_id, data)
              : handleCreateStore
          }
          onClose={() => {
            setShowCreateForm(false);
            setEditingStore(null);
          }}
        />
      )}
    </div>
  );
};

const StoreCard = ({ store, onEdit, onUpdate }) => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const storeStats = await OwnerService.getStoreStats(store.tienda_id);
      setStats(storeStats);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [store.tienda_id]);

  return (
    <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-[#31343A]/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-[500px] flex flex-col">
      {/* Imagen placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D] to-[#B47B1C] rounded-2xl flex items-center justify-center shadow-lg">
            <BuildingStorefrontIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        {/* Overlay para efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#23262B]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2 group-hover:text-[#D1A04D] transition-colors duration-300">
                {store.tienda_nombre}
              </h3>
              <p className="text-[#B0B3B8] text-sm leading-relaxed line-clamp-2">
                {store.tienda_descripcion ||
                  "Descubre los mejores servicios de belleza en esta tienda."}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                store.tienda_estado === 1
                  ? "text-green-400 bg-green-500/10 border-green-500/20"
                  : "text-red-400 bg-red-500/10 border-red-500/20"
              }`}
            >
              {store.tienda_estado === 1 ? "Activa" : "Inactiva"}
            </span>
          </div>

          {/* Información de contacto */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center text-[#B0B3B8] text-sm">
              <PhoneIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="truncate">
                {store.tienda_telefono || "Sin teléfono"}
              </span>
            </div>
            <div className="flex items-center text-[#B0B3B8] text-sm">
              <EnvelopeIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="truncate">
                {store.tienda_correo || "Sin email"}
              </span>
            </div>
            <div className="flex items-center text-[#B0B3B8] text-xs">
              <MapPinIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span className="truncate">
                {store.tienda_direccion || "Sin dirección"}
              </span>
            </div>
            <div className="flex items-center text-[#B0B3B8] text-xs">
              <ClockIcon className="w-4 h-4 mr-2 text-[#D1A04D]" />
              <span>
                Horario: {store.tienda_hora_apertura} -{" "}
                {store.tienda_hora_cierre}
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
                    {stats.totalEmployees || 0}
                  </p>
                  <p className="text-xs text-[#B0B3B8]">Empleados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#D1A04D]">
                    {stats.totalAppointments || 0}
                  </p>
                  <p className="text-xs text-[#B0B3B8]">Citas</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Botones de acción - Siempre en la parte inferior */}
        <div className="flex space-x-2 mt-6">
          <button
            onClick={() => onEdit(store)}
            className="flex-1 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold py-3 px-4 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <Link
            to={`/propietario/tiendas/${store.tienda_id}/detalle`}
            className="flex-1 bg-[#23262B]/80 backdrop-blur-md text-[#D1A04D] font-semibold py-3 px-4 rounded-xl hover:bg-[#31343A]/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-[#D1A04D]/30 hover:border-[#D1A04D]/50 flex items-center justify-center space-x-2"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Ver Detalles</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const StoreForm = ({ store, businesses, categories, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    negocio_id: store?.negocio_id || "",
    categoria_id: store?.categoria_id || "",
    tienda_nombre: store?.tienda_nombre || "",
    tienda_descripcion: store?.tienda_descripcion || "",
    tienda_direccion: store?.tienda_direccion || "",
    tienda_telefono: store?.tienda_telefono || "",
    tienda_correo: store?.tienda_correo || "",
    tienda_ciudad: store?.tienda_ciudad || "",
    tienda_hora_apertura: store?.tienda_hora_apertura || "08:00",
    tienda_hora_cierre: store?.tienda_hora_cierre || "18:00",
    tienda_estado: store?.tienda_estado || 1,
  });

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
      <div className="bg-[#23262B]/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg mx-4 border border-[#31343A]/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#F5F5F5]">
            {store ? "Editar Tienda" : "Nueva Tienda"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#B0B3B8] hover:text-[#F5F5F5] transition-colors duration-300 p-1 rounded-lg hover:bg-[#31343A]/50"
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Negocio
            </label>
            <select
              name="negocio_id"
              value={formData.negocio_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
            >
              <option value="">Seleccionar negocio</option>
              {businesses.map((business) => (
                <option key={business.negocio_id} value={business.negocio_id}>
                  {business.negocio_nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Categoría de Tienda
            </label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option
                  key={category.categoria_id}
                  value={category.categoria_id}
                >
                  {category.categoria_nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Nombre de la Tienda
            </label>
            <input
              type="text"
              name="tienda_nombre"
              value={formData.tienda_nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] placeholder-[#B0B3B8] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              placeholder="Ingresa el nombre de la tienda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Descripción
            </label>
            <textarea
              name="tienda_descripcion"
              value={formData.tienda_descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] placeholder-[#B0B3B8] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              placeholder="Describe la tienda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="tienda_direccion"
              value={formData.tienda_direccion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] placeholder-[#B0B3B8] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              placeholder="Ingresa la dirección"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Ciudad
            </label>
            <input
              type="text"
              name="tienda_ciudad"
              value={formData.tienda_ciudad}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] placeholder-[#B0B3B8] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              placeholder="Ingresa la ciudad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="tienda_telefono"
              value={formData.tienda_telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] placeholder-[#B0B3B8] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              placeholder="Ingresa el teléfono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
              Email
            </label>
            <input
              type="email"
              name="tienda_correo"
              value={formData.tienda_correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] placeholder-[#B0B3B8] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              placeholder="Ingresa el email"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Hora Apertura
              </label>
              <input
                type="time"
                name="tienda_hora_apertura"
                value={formData.tienda_hora_apertura}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B0B3B8] mb-2">
                Hora Cierre
              </label>
              <input
                type="time"
                name="tienda_hora_cierre"
                value={formData.tienda_hora_cierre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#31343A]/50 rounded-xl text-[#F5F5F5] focus:ring-2 focus:ring-[#D1A04D]/50 focus:border-[#D1A04D]/50 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#23262B]/80 backdrop-blur-md text-[#B0B3B8] py-3 px-4 rounded-xl hover:bg-[#31343A]/50 hover:text-[#F5F5F5] transition-all duration-300 border border-[#31343A]/50 hover:border-[#D1A04D]/30"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white py-3 px-4 rounded-xl hover:from-[#B47B1C] hover:to-[#D1A04D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {store ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreManagement;
