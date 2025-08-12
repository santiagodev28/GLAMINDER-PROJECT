import Auth from "../models/Auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
// Controlador de autenticacion
class AuthController {
    static async userLogin(req, res) { // Función para iniciar sesión
        const { usuario_correo, usuario_contrasena } = req.body;

        if (!usuario_correo || !usuario_contrasena) {
            return res
                .status(400)
                .json({ message: "Por favor completa los campos." });
        }

        try {
            const user = await Auth.findUserByEmail(usuario_correo);

            if (!user) {
                return res
                    .status(401)
                    .json({ message: "Credenciales incorrectas." });
            }

            const isPasswordValid = await bcrypt.compare(
                usuario_contrasena,
                user.usuario_contrasena
            );

            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ message: "Credenciales incorrectas." });
            }

            const token = jwt.sign(
                { usuario_id: user.usuario_id, rol: user.rol_id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                message: "Inicio de sesión exitoso.",
                token,
                usuario: {
                    usuario_id: user.usuario_id,
                    usuario_nombre: user.usuario_nombre,
                    usuario_apellido: user.usuario_apellido,
                    usuario_correo: user.usuario_correo,
                    usuario_telefono: user.usuario_telefono,
                    rol_id: user.rol_id,
                },
            });
        } catch {
            console.error("Error al iniciar sesión:", error);
            return res
                .status(500)
                .json({ message: "Error al iniciar sesión." });
        }
    }

    static async userRegister(req, res) {
    try {
        const {
            usuario_nombre,
            usuario_apellido,
            usuario_correo,
            usuario_contrasena,
            usuario_telefono,
            rol_id,
            tienda_id,
            empleado_especialidad,
        } = req.body;

        // Validar campos obligatorios
        if (
            !usuario_nombre ||
            !usuario_apellido ||
            !usuario_correo ||
            !usuario_contrasena ||
            !usuario_telefono
        ) {
            return res.status(400).json({
                message: "Por favor completa todos los campos.",
            });
        }

        // Verificar si el correo ya existe
        const existingUser = await Auth.findUserByEmail(usuario_correo);
        if (existingUser) {
            return res.status(400).json({
                message: "El correo ya está registrado.",
            });
        }

        // Crear el usuario (solo si no existe)
        const newUser= await Auth.createUser({
            usuario_nombre,
            usuario_apellido,
            usuario_correo,
            usuario_contrasena,
            usuario_telefono,
        });

        return res.status(200).json({
            message: "Usuario registrado exitosamente.",
            data: newUser,
        });

    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        return res.status(500).json({
            message: "Error al registrar el usuario.",
        });
    }
}


    static async logout (req, res) { // Función para cerrar sesión
        req.session.destroy();
        res.json({ message: "Sesion cerrada exitosamente." });
    }
}



export default AuthController