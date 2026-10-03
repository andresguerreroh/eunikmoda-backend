import { Router } from "express";
import { coleccionPublicController } from "../../controllers/public/coleccion.controller";

export const coleccionPublicRouter = Router();
coleccionPublicRouter.get("/", coleccionPublicController.listar);
