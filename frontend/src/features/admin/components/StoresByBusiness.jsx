import { useEffect, useState } from "react";
import { fetchStoresByBusiness } from "../../../services/adminService.js";
import { useParams, Link } from "react-router-dom";
import ButtonBack  from "../../../components/buttons/ButtonBack";
// Componente para mostrar las tiendas de un negocio
const StoresByBusinessTable = () => {
    const { negocio_id } = useParams();
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const loadStores = async () => {
            try {
                const stores = await fetchStoresByBusiness(negocio_id);
                setStores(stores);
            } catch (error) {
                console.error("Error al obtener las tiendas:", error);
            }
        } 
        loadStores();
    }, [negocio_id]);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Tiendas del Negocio</h1>

            <table className="w-full border-collapse border border-gray-300 mb-4 ">
                <thead className="bg-gray-100">
                    <tr className="border border-gray-300">
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Dirección</th>
                        <th className="p-2 border">Teléfono</th>
                        <th className="p-2 border">Correo</th>
                        <th className="p-2 border">Ciudad</th>
                        <th className="p-2 border">Estado</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody >
                    {stores.map((s) => (
                        <tr key={s.tienda_id}>
                            <td className="p-2 border">{s.tienda_nombre}</td>
                            <td className="p-2 border">{s.tienda_direccion}</td>
                            <td className="p-2 border">{s.tienda_telefono}</td>
                            <td className="p-2 border">{s.tienda_correo}</td>
                            <td className="p-2 border">{s.tienda_ciudad}</td>
                            <td className="p-2 border">{s.tienda_activa}</td>
                            <td className="p-2 border">

                               <Link to={`/admin/negocios/${negocio_id}/tiendas/${s.tienda_id}/empleados`}>
                                <button className="text-blue-600 hover:underline mr-2">
                                    Ver Empleados
                                </button> 
                               </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ButtonBack to="/admin/negocios" />
            </div>
            
        </div>

    )
}

export default StoresByBusinessTable;
