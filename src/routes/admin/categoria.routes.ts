import { Router } from "express";
import { categoriaAdminController } from "../../controllers/admin/categoria.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { crearCategoriaSchema, actualizarCategoriaSchema } from "../../dtos/categoria.dto";

export const categoriaAdminRouter = Router();
categoriaAdminRouter.use(authMiddleware, requireRole("admin", "editor"));
categoriaAdminRouter.get("/", categoriaAdminController.listar);
categoriaAdminRouter.post("/", validate(crearCategoriaSchema), categoriaAdminController.crear);
categoriaAdminRouter.patch("/:id", validate(actualizarCategoriaSchema), categoriaAdminController.actualizar);
categoriaAdminRouter.delete("/:id", requireRole("admin"), categoriaAdminController.eliminar);
