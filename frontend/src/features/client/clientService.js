import api from "../../api/api.js"

export const requestOwner = async(data,token) => {
    try{
        const res = await api.post("/solicitudes", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (error){
        console.error("Error al enviar la solicitud de propietario", error)
        return null
    }
}