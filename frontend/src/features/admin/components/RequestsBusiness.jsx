import { useEffect, useState } from "react";
import requestService from "../../../services/requestService";

const RequestsBusiness = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getAll();
      setRequests(data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      setError("Error al cargar las solicitudes. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setError(null);
      await requestService.approve(id);
      
      // Actualizar el estado local sin recargar todo
      setRequests(prev => 
        prev.map(req => 
          req.solicitud_id === id 
            ? { ...req, estado: 'aprobado' }
            : req
        )
      );
      
      // También recargar para obtener datos actualizados del servidor
      await loadRequests();
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
      setError(`Error al aprobar la solicitud: ${error.response?.data?.details || error.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      setError(null);
      await requestService.reject(id);
      
      // Actualizar el estado local sin recargar todo
      setRequests(prev => 
        prev.map(req => 
          req.solicitud_id === id 
            ? { ...req, estado: 'rechazado' }
            : req
        )
      );
      
      // También recargar para obtener datos actualizados del servidor
      await loadRequests();
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      setError(`Error al rechazar la solicitud: ${error.response?.data?.details || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Solicitudes de Propietario</h2>
        <button
          onClick={loadRequests}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay solicitudes para mostrar
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border-b">ID</th>
                <th className="p-3 text-left border-b">Usuario</th>
                <th className="p-3 text-left border-b">Negocio</th>
                <th className="p-3 text-left border-b">Dirección</th>
                <th className="p-3 text-left border-b">Estado</th>
                <th className="p-3 text-left border-b">Fecha</th>
                <th className="p-3 text-center border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.solicitud_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{req.solicitud_id}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">
                        {req.usuario_nombre} {req.usuario_apellido}
                      </div>
                      <div className="text-sm text-gray-500">
                        {req.usuario_correo}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{req.nombre_negocio}</div>
                      {req.telefono_negocio && (
                        <div className="text-sm text-gray-500">
                          {req.telefono_negocio}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm">{req.direccion_negocio}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      req.estado === 'pendiente' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : req.estado === 'aprobado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {req.estado}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(req.fecha_solicitud).toLocaleDateString('es-ES')}
                  </td>
                  <td className="p-3 text-center">
                    {req.estado === "pendiente" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(req.solicitud_id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(req.solicitud_id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        {req.estado === 'aprobado' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestsBusiness;