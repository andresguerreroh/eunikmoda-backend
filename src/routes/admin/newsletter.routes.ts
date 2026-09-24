import { Router } from "express";
import { newsletterAdminController } from "../../controllers/admin/newsletter.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { notificarNovedadesSchema } from "../../dtos/newsletter.dto";

export const newsletterAdminRouter = Router();

newsletterAdminRouter.use(authMiddleware, requireRole("admin", "editor"));
newsletterAdminRouter.post(
  "/notificar-novedades",
  validate(notificarNovedadesSchema),
  newsletterAdminController.notificarNovedades
);
