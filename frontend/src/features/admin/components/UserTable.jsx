import { useEffect, useState } from "react";
import AdminService from "../../../services/adminService.js";
import RoleFilter from "./RoleFilter";
import EditUserModal from "../../../components/modals/EditUserModal";
import ConfirmDeleteModal from "../../../components/modals/ConfirmDeleteModal";
import ButtonBack from "../../../components/buttons/ButtonBack";
import DataTable from "../../../components/common/DataTable";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import { toast } from "react-toastify";

// Componente para mostrar la tabla de usuarios
const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeletedUsers, setShowDeletedUsers] = useState(false);
    const [selectedRole, setSelectedRole] = useState("todos");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

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

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleUserDelete = async () => {
        if (!userToDelete) return;

        try {
            await AdminService.deleteUser(userToDelete.usuario_id);
            toast.success("Usuario eliminado con éxito", {
                position: "top-right",
                autoClose: 3000,
            });
            getUsers();
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            toast.error("No se pudo eliminar el usuario", {
                position: "top-right",
                autoClose: 5000,
            });
            console.error("Error al eliminar el usuario:", error);
        }
    };

    // Filtrar usuarios por rol
    const filteredUsers = users.filter(
        (u) => selectedRole === "todos" || u.rol_id === parseInt(selectedRole)
    );

    // Configuración de columnas para DataTable
    const columns = [
        { key: "usuario_id", label: "ID", sortable: true },
        { key: "usuario_nombre", label: "Nombre", sortable: true },
        { key: "usuario_apellido", label: "Apellido", sortable: true },
        { key: "usuario_correo", label: "Correo", sortable: true },
        {
            key: "rol_id",
            label: "Rol",
            sortable: true,
            render: (value) => (value ? rolToString(value) : "-"),
        },
        {
            key: "acciones",
            label: "Acciones",
            sortable: false,
            render: (_, row) => (
                <div>
                    <button
                        className="text-blue-600 hover:underline mr-2"
                        onClick={() => handleEdit(row)}
                    >
                        Editar
                    </button>
                    <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteClick(row)}
                    >
                        Eliminar
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Breadcrumbs
                items={[
                    { label: "Usuarios", path: "/admin/usuarios" },
                ]}
                homePath="/admin/dashboard"
            />
            <div className="flex justify-between items-center mb-4">
                <label htmlFor="role-filter" className="font-semibold">
                    {" "}
                    Filtar por rol:
                </label>
                <RoleFilter selected={selectedRole} onChange={setSelectedRole} />
            </div>
            <h2 className="text-2xl font-bold mb-4">
                {showDeletedUsers
                    ? "Usuarios Eliminados"
                    : "Usuarios Registrados"}
            </h2>
            <DataTable
                data={filteredUsers}
                columns={columns}
                itemsPerPage={10}
                emptyMessage="No hay usuarios para mostrar"
            />

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

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                }}
                onConfirm={handleUserDelete}
                title="Eliminar Usuario"
                message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.usuario_nombre} ${userToDelete?.usuario_apellido}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar Usuario"
                itemName={userToDelete ? `${userToDelete.usuario_nombre} ${userToDelete.usuario_apellido}`.toUpperCase() : ""}
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
