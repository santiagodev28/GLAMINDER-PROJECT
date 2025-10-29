const RoleChangeModal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-900">
    <div className="bg-black/90 p-6 rounded-2xl shadow-lg w-96 text-center">
      <h2 className="text-[#D1A04D] text-xl font-bold mb-3">{title}</h2>
      {children}
      <button
        onClick={onClose}
        className="bg-[#D1A04D] text-white px-4 py-2 rounded-lg hover:bg-[#B47B1C] transition"
      >
        Entendido
      </button>
    </div>
  </div>
);

export default RoleChangeModal;