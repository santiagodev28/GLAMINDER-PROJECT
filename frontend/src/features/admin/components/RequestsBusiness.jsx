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
      <div className="min-h-screen bg-[#23262B] flex justify-center items-center p-8">
        <div className="text-lg text-[#F5F5F5]">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#23262B] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#F5F5F5]">Solicitudes de Propietario</h2>
          <button
            onClick={loadRequests}
            className="bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] hover:shadow-lg hover:shadow-[#D1A04D]/20 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            Actualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-[#2A2D35] rounded-xl border border-[#31343A] p-12 text-center">
            <p className="text-[#B0B3B8] text-lg">No hay solicitudes para mostrar</p>
          </div>
        ) : (
          <div className="bg-[#2A2D35] rounded-xl border border-[#31343A] shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#23262B] border-b border-[#31343A]">
                    <th className="p-4 text-left text-[#D1A04D] font-semibold">ID</th>
                    <th className="p-4 text-left text-[#D1A04D] font-semibold">Usuario</th>
                    <th className="p-4 text-left text-[#D1A04D] font-semibold">Negocio</th>
                    <th className="p-4 text-left text-[#D1A04D] font-semibold">Dirección</th>
                    <th className="p-4 text-left text-[#D1A04D] font-semibold">Estado</th>
                    <th className="p-4 text-left text-[#D1A04D] font-semibold">Fecha</th>
                    <th className="p-4 text-center text-[#D1A04D] font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.solicitud_id} className="border-b border-[#31343A] hover:bg-[#31343A]/30 transition-colors">
                      <td className="p-4 text-[#F5F5F5]">{req.solicitud_id}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-[#F5F5F5]">
                            {req.usuario_nombre} {req.usuario_apellido}
                          </div>
                          <div className="text-sm text-[#B0B3B8]">
                            {req.usuario_correo}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-[#F5F5F5]">{req.nombre_negocio}</div>
                          {req.telefono_negocio && (
                            <div className="text-sm text-[#B0B3B8]">
                              {req.telefono_negocio}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#B0B3B8]">{req.direccion_negocio}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          req.estado === 'pendiente' 
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : req.estado === 'aprobado'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {req.estado}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#B0B3B8]">
                        {new Date(req.fecha_solicitud).toLocaleDateString('es-ES')}
                      </td>
                      <td className="p-4 text-center">
                        {req.estado === "pendiente" ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleApprove(req.solicitud_id)}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleReject(req.solicitud_id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                            >
                              Rechazar
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#B0B3B8] text-sm">
                            {req.estado === 'aprobado' ? 'Aprobada' : 'Rechazada'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsBusiness;