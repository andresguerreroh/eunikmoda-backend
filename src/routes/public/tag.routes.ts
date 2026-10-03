import { Router } from "express";
import { tagPublicController } from "../../controllers/public/tag.controller";

export const tagPublicRouter = Router();
tagPublicRouter.get("/", tagPublicController.listar);
