import { Router } from "express";
import { categoriaPublicRouter } from "./categoria.routes";
import { productoPublicRouter } from "./producto.routes";
import { newsletterPublicRouter } from "./newsletter.routes";
import { marcaPublicRouter } from "./marca.routes";
import { tallaPublicRouter } from "./talla.routes";
import { origenPublicRouter } from "./origen.routes";
import { temporadaPublicRouter } from "./temporada.routes";
import { coleccionPublicRouter } from "./coleccion.routes";
import { materialPublicRouter } from "./material.routes";
import { colorPublicRouter } from "./color.routes";
import { tagPublicRouter } from "./tag.routes";

export const publicRouter = Router();

publicRouter.use("/categorias", categoriaPublicRouter);
publicRouter.use("/products", productoPublicRouter);
publicRouter.use("/newsletter", newsletterPublicRouter);
publicRouter.use("/marcas", marcaPublicRouter);
publicRouter.use("/tallas", tallaPublicRouter);
publicRouter.use("/origenes", origenPublicRouter);
publicRouter.use("/temporadas", temporadaPublicRouter);
publicRouter.use("/colecciones", coleccionPublicRouter);
publicRouter.use("/materiales", materialPublicRouter);
publicRouter.use("/colores", colorPublicRouter);
publicRouter.use("/tags", tagPublicRouter);
