import { Router } from "express";
import { marcaPublicController } from "../../controllers/public/marca.controller";

export const marcaPublicRouter = Router();
marcaPublicRouter.get("/", marcaPublicController.listar);
