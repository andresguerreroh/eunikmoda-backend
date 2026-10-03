import { Router } from "express";
import { origenPublicController } from "../../controllers/public/origen.controller";

export const origenPublicRouter = Router();
origenPublicRouter.get("/", origenPublicController.listar);
