import api from "../api/api.js"

export const requestOwner = async(data,token) => {
    try{
        const res = await api.post("/solicitudes/crear", data, {
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

export const messageChangeRole = async( token, usuario_id) => {
    try {
        const res = await api.put(`/usuarios/rolCambiado/${usuario_id}`, {
            rol_cambiado: 1
        },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (error) {
        console.error("Error al hacer el cambio de rol", error)
        return null
    }
}

