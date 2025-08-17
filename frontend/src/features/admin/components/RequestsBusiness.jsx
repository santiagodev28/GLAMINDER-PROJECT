import { useEffect, useState } from "react";
import requestService from "../../../services/requestService";

const RequestsBusiness = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await requestService.getAll();
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    await requestService.approve(id);
    loadRequests();
  };

  const handleReject = async (id) => {
    await requestService.reject(id);
    loadRequests();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Solicitudes de Propietario</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Usuario</th>
            <th className="p-2">Negocio</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.solicitud_id} className="border-t">
              <td className="p-2">{req.usuario_nombre} {req.usuario_apellido}</td>
              <td className="p-2">{req.nombre_negocio}</td>
              <td className="p-2">{req.estado}</td>
              <td className="p-2">
                {req.estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => handleApprove(req.solicitud_id)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(req.solicitud_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Rechazar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default RequestsBusiness;