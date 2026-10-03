import { Router } from "express";
import { tallaPublicController } from "../../controllers/public/talla.controller";

export const tallaPublicRouter = Router();
tallaPublicRouter.get("/", tallaPublicController.listar);
