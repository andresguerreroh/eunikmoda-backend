import { Router } from "express";
import { authRouter } from "./auth.routes";
import { categoriaAdminRouter } from "./categoria.routes";
import { productoAdminRouter } from "./producto.routes";
import { uploadAdminRouter } from "./upload.routes";
import { newsletterAdminRouter } from "./newsletter.routes";

export const adminRouter = Router();

adminRouter.use("/auth", authRouter);
adminRouter.use("/categorias", categoriaAdminRouter);
adminRouter.use("/productos", productoAdminRouter);
adminRouter.use("/uploads", uploadAdminRouter);
adminRouter.use("/newsletter", newsletterAdminRouter);
