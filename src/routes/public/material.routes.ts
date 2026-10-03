import { Router } from "express";
import { materialPublicController } from "../../controllers/public/material.controller";

export const materialPublicRouter = Router();
materialPublicRouter.get("/", materialPublicController.listar);
