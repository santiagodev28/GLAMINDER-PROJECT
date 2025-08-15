import { useState } from "react";
import logo from "../../../assets/images/logo-2.png";
import {
  ArrowPathIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import { requestOwner } from "../clientService";

const RequestOwner = () => {
  const [business, setBusiness] = useState({
    nombre_negocio: "",
    direccion_negocio: "",
    telefono_negocio: "",
    correo_negocio: "",
    descripcion_negocio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const data = await requestOwner(business, token);

      if (data) {
        setSuccess("¡Solicitud enviada! Un administrador lo revisará.");
        setBusiness({
          nombre_negocio: "",
          direccion_negocio: "",
          telefono_negocio: "",
          correo_negocio: "",
          descripcion_negocio: "",
        });
      } else {
        setError("No se pudo enviar la solicitud. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      setError("Ocurrió un error en el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg">
        {/* Logo y título */}
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Glaminder Logo"
            className="h-32 mx-auto drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold text-gray-800">Panel de Cliente</h1>
          <p className="text-gray-600">Solicita convertirte en propietario</p>
        </div>

        {/* Mensajes */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-600">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={sendRequest}
          className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del negocio
            </label>
            <input
              type="text"
              name="nombre_negocio"
              value={business.nombre_negocio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="direccion_negocio"
              value={business.direccion_negocio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono_negocio"
              value={business.telefono_negocio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo del negocio
            </label>
            <input
              type="email"
              name="correo_negocio"
              value={business.correo_negocio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion_negocio"
              value={business.descripcion_negocio}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5" />
                Enviando solicitud...
              </>
            ) : (
              <>
                <BuildingStorefrontIcon className="h-5 w-5" />
                Solicitar cuenta de propietario
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestOwner;
