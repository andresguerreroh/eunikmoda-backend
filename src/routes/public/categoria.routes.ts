import { Router } from "express";
import { categoriaPublicController } from "../../controllers/public/categoria.controller";
export const categoriaPublicRouter = Router();
categoriaPublicRouter.get("/", categoriaPublicController.listar);
