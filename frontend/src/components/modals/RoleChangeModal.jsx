const RoleChangeModal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
      <button
        onClick={onClose}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Entendido
      </button>
    </div>
  </div>
);

export default RoleChangeModal;