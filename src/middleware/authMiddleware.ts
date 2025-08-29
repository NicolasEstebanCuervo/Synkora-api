import { Request, Response, NextFunction } from "express";
import { auth } from "../firebase.js";
import { AuthErrors } from "../types/auth/authErrors.js";

interface AuthenticatedRequest extends Request {
    user?: { uid: string; [key: string]: any };
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token missing",
                code: AuthErrors.TokenMissing,
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await auth.verifyIdToken(token);
        req.user = { uid: decodedToken.uid, ...decodedToken };

        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid token", code: AuthErrors.InvalidToken });
    }
};
