import { Router } from "express";
import { productoAdminController } from "../../controllers/admin/producto.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { crearProductoSchema } from "../../dtos/producto.dto";

export const productoAdminRouter = Router();

productoAdminRouter.use(authMiddleware, requireRole("admin", "editor"));

productoAdminRouter.get("/", productoAdminController.listar);
productoAdminRouter.post("/", validate(crearProductoSchema), productoAdminController.crear);
