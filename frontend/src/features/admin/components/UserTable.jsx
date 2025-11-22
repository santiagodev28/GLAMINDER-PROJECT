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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div className="flex gap-3">
                    <button
                        className="text-[#D1A04D] hover:text-[#B47B1C] font-medium transition-colors"
                        onClick={() => handleEdit(row)}
                    >
                        Editar
                    </button>
                    <button
                        className="text-red-400 hover:text-red-300 font-medium transition-colors"
                        onClick={() => handleDeleteClick(row)}
                    >
                        Eliminar
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#23262B] p-6">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: "Usuarios", path: "/admin/usuarios" },
                    ]}
                    homePath="/admin/dashboard"
                />
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#F5F5F5]">
                        {showDeletedUsers
                            ? "Usuarios Eliminados"
                            : "Usuarios Registrados"}
                    </h2>
                    <div className="flex items-center gap-3">
                        <label htmlFor="role-filter" className="text-[#F5F5F5] font-medium">
                            Filtrar por rol:
                        </label>
                        <RoleFilter selected={selectedRole} onChange={setSelectedRole} />
                    </div>
                </div>
                
                <div className="bg-[#2A2D35] rounded-xl border border-[#31343A] shadow-lg overflow-hidden">
                    <DataTable
                        data={filteredUsers}
                        columns={columns}
                        itemsPerPage={10}
                        emptyMessage="No hay usuarios para mostrar"
                    />
                </div>

                <div className="flex flex-col gap-3 py-6">
                    <button
                        className="text-center w-full bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] py-3 px-6 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-[#D1A04D]/20 transition-all duration-300"
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
