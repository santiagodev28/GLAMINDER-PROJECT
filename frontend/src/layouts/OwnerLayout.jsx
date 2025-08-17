import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleChangeModal from "../components/modals/RoleChangeModal";
import api from "../api/api";
import { messageChangeRole } from "../services/clientService";

const LayoutOwner = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(() => {
        const usuario = localStorage.getItem("usuario");
        return usuario ? JSON.parse(usuario) : null;
    });
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Consulta el usuario actualizado al backend
        const fetchUser = async () => {
            try {
                const res = await api.get(`/usuarios/${user.usuario_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const updatedUser = Array.isArray(res.data) ? res.data[0] : res.data;
                localStorage.setItem("usuario", JSON.stringify(updatedUser));
                setUser(updatedUser);
                if (updatedUser.rol_cambiado === 1) {
                    setShowModal(true);
                }
            } catch (error) {
                console.error("Error al obtener usuario actualizado:", error);
            }
        };
        fetchUser();
    }, []);

    const handleCloseModal = async () => {
        try {
            await messageChangeRole(token, user.usuario_id);
            const updatedUser = { ...user, rol_cambiado: 0 };
            localStorage.setItem("usuario", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            console.error("Error al actualizar rol_cambiado:", error);
        } finally {
            setShowModal(false);
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-screen">No hay usuario autenticado.</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {showModal && (
                <RoleChangeModal onClose={handleCloseModal} title="¡Felicidades!">
                    <p className="text-lg text-gray-700">
                        Tu rol ha sido actualizado a <strong>Propietario</strong>. Ahora puedes gestionar tu(s) negocio(s) desde este panel.
                    </p>
                </RoleChangeModal>
            )}
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default LayoutOwner;
