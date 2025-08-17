import { useEffect, useState } from "react";
import requestService from "../../../services/requestService.js";

const RequestStatus = ({ user }) => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const res = await requestService.getByUser(user.usuario_id);
            if (res) setStatus(res.estado);
        } catch (error) {
            console.error("Error al cargar el estado de la solicitud:", error);
        }
    };
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold">
                Bienvenido {user.usuario_nombre}
            </h2>

            {status === null && (
                <p className="mt-4">
                    Aún no has enviado solicitud para ser propietario.
                </p>
            )}

            {status === "pendiente" && (
                <p className="mt-4 text-yellow-600 font-semibold">
                    Tu solicitud está en revisión. Por favor, espera.
                </p>
            )}

            {status === "rechazada" && (
                <p className="mt-4 text-red-600 font-semibold">
                    Tu solicitud fue rechazada
                </p>
            )}

            {status === "aprobada" && (
                <p className="mt-4 text-green-600 font-semibold">
                    ¡Tu solicitud fue aprobada! Ahora eres propietario.
                </p>
            )}
        </div>
    );
};

export default RequestStatus;