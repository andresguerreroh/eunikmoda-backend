import { Router } from "express";
import { newsletterPublicController } from "../../controllers/public/newsletter.controller";
import { validate } from "../../middlewares/validate.middleware";
import { suscribirSchema } from "../../dtos/newsletter.dto";

export const newsletterPublicRouter = Router();

newsletterPublicRouter.post("/suscribir", validate(suscribirSchema), newsletterPublicController.suscribir);
