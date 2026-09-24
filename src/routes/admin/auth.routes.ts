import { Router } from "express";
import { authController } from "../../controllers/admin/auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema } from "../../dtos/auth.dto";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const authRouter = Router();
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authMiddleware, authController.me);
