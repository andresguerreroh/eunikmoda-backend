import { Router } from "express";
import { colorPublicController } from "../../controllers/public/color.controller";

export const colorPublicRouter = Router();
colorPublicRouter.get("/", colorPublicController.listar);
