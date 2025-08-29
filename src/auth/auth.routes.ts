import { Router } from "express";
import { AuthController } from "./auth.controller.js";

export const createAuthRouter = ({ authModel }) => {
    const authRouter = Router();
    const authController = new AuthController({ authModel });

    authRouter.post("/register", authController.register);
    authRouter.post("/google", authController.authWithGoogle);
    authRouter.post("/login", authController.login);

    return authRouter;
};
