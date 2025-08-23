import { useEffect, useState } from "react";
import AdminService from "../../../services/adminService.js";
import RoleFilter from "./RoleFilter";
import EditUserModal from "../../../components/modals/EditUserModal";
import ButtonBack  from "../../../components/buttons/ButtonBack";

// Componente para mostrar la tabla de usuarios
const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeletedUsers, setShowDeletedUsers] = useState(false);
    const [selectedRole, setSelectedRole] = useState("todos");

    const getUsers = async () => {
        try {
            const users = await AdminService.getUsersByState(showDeletedUsers); 
            console.log("usuarios recibidos", users);
            setUsers(users);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, [showDeletedUsers]);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    const handleUserUpdated = () => {
        getUsers(); // Recargar la tabla
    };

    const handleUserDelete = async (usuario_id) => {
        const confirmDelete = window.confirm(
            "¿Estás seguro de eliminar este usuario?"
        );
        if (!confirmDelete) return;

        try {
            const userDeleted = await AdminService.deleteUser(usuario_id);
            console.log("Usuario eliminado:", userDeleted);
           
                alert("Usuario eliminado con éxito");
                getUsers();
        } catch (error) {
            alert("No se pudo eliminar el usuario");
            console.error("Error al eliminar el usuario:", error);
        }
    };
 
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <label htmlFor="role-filter" className="font-semibold"> Filtar por rol:</label>
                <RoleFilter selected={selectedRole} onChange={setSelectedRole} />
            </div>
            <h2 className="text-2xl font-bold mb-4">
                {showDeletedUsers
                    ? "Usuarios Eliminados"
                    : "Usuarios Registrados"}
            </h2>
            <table className="w-full border text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Apellido</th>
                        <th className="p-2 border">Correo</th>
                        <th className="p-2 border">Rol</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter((u) => selectedRole === "todos" || u.rol_id === parseInt(selectedRole)).map((u) => (
                        <tr key={u.usuario_id}>
                            <td className="p-2 border">{u.usuario_id}</td>
                            <td className="p-2 border">{u.usuario_nombre}</td>
                            <td className="p-2 border">{u.usuario_apellido}</td>
                            <td className="p-2 border">{u.usuario_correo}</td>
                            <td className="p-2 border">
                                {u.rol_id && rolToString(u.rol_id)}
                            </td>
                            <td className="p-2 border">
                                <button
                                    className="text-blue-600 hover:underline mr-2"
                                    onClick={() => handleEdit(u)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={() =>
                                        handleUserDelete(u.usuario_id)
                                    }
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex flex-col gap-2 py-4">
                <button
                    className="text-center w-full bg-slate-600 py-2 px-4 rounded text-white hover:bg-slate-700"
                    onClick={() => setShowDeletedUsers(!showDeletedUsers)}
                >
                    {showDeletedUsers
                        ? "Mostrar Usuarios Activos"
                        : "Mostrar Usuarios Eliminados"}
                </button>
                <ButtonBack to="/admin/dashboard" />
            </div>
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModal}
                user={selectedUser}
                onSave={handleUserUpdated}
            />
        </div>
    );
};

const rolToString = (rol) => {
    switch (rol) {
        case 1:
            return "Administrador";
        case 2:
            return "Propietario";
        case 3:
            return "Empleado";
        case 4:
            return "Cliente";
        default:
            return "Desconocido";
    }
};

export default UserAdmin;
