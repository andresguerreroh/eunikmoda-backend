import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { uploadImagen } from "../../middlewares/upload.middleware";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const uploadAdminRouter = Router();

uploadAdminRouter.use(authMiddleware, requireRole("admin", "editor"));

uploadAdminRouter.post(
  "/",
  (req, res, next) => uploadImagen(req, res, (err) => (err ? next(ApiError.badRequest(err.message)) : next())),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest("No se recibió ningún archivo.");
    res.status(201).json({ data: { url: `/uploads/${req.file.filename}` } });
  })
);
