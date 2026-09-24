import bcrypt from "bcryptjs";
import { usuarioRepository } from "../repositories/usuario.repository";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export const authService = {
  async login(email: string, password: string) {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario || !usuario.activo) throw ApiError.unauthorized("Correo o contraseña incorrectos.");
    const passwordOk = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordOk) throw ApiError.unauthorized("Correo o contraseña incorrectos.");
    const token = signToken({ sub: usuario.id, rol: usuario.rol, nombre: usuario.nombre });
    return { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } };
  },
};
