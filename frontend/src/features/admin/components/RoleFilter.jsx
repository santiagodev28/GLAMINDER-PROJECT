// Componente para filtrar por rol
const RoleFilter = ({ selected, onChange }) => {
    return (
        <select
            className="bg-[#2A2D35] border border-[#31343A] text-[#F5F5F5] px-4 py-2 rounded-lg focus:outline-none focus:border-[#D1A04D] focus:ring-1 focus:ring-[#D1A04D] transition-colors cursor-pointer"
            value={selected}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="todos" className="bg-[#2A2D35]">Todos</option>
            <option value="1" className="bg-[#2A2D35]">Administrador</option>
            <option value="2" className="bg-[#2A2D35]">Propietario</option>
            <option value="3" className="bg-[#2A2D35]">Empleado</option>
            <option value="4" className="bg-[#2A2D35]">Cliente</option>
        </select>
    );
};

export default RoleFilter;
