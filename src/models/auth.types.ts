export type Rol = "admin" | "editor" | "cliente";
export interface AppJwtPayload { sub: number; rol: Rol; nombre: string; }
export interface Usuario {
  id: number; nombre: string; email: string; password_hash: string; rol: Rol; activo: boolean;
}
