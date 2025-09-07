import useAuth from "../../services/authService";

const ButtonCloseSession = ({ token, onClose }) => {

    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
            Cerrar sesión
        </button>
    );
};

export default ButtonCloseSession;
