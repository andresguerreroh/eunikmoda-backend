import { Router } from "express";
import { categoriaPublicRouter } from "./categoria.routes";
import { productoPublicRouter } from "./producto.routes";
import { newsletterPublicRouter } from "./newsletter.routes";

export const publicRouter = Router();

publicRouter.use("/categorias", categoriaPublicRouter);
publicRouter.use("/products", productoPublicRouter);
publicRouter.use("/newsletter", newsletterPublicRouter);
