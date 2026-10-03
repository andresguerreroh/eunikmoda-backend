import { Router } from "express";
import { temporadaPublicController } from "../../controllers/public/temporada.controller";

export const temporadaPublicRouter = Router();
temporadaPublicRouter.get("/", temporadaPublicController.listar);
