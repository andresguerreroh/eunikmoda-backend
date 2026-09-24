import { Router } from "express";
import { productoPublicController } from "../../controllers/public/producto.controller";
import { validate } from "../../middlewares/validate.middleware";
import { listarProductosQuerySchema } from "../../dtos/producto.dto";

export const productoPublicRouter = Router();

productoPublicRouter.get("/", validate(listarProductosQuerySchema, "query"), productoPublicController.listar);
productoPublicRouter.get("/:slug", productoPublicController.detalle);
