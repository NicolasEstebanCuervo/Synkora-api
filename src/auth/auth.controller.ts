import { NextFunction, Request, Response } from "express";
import {
    UserRegisterDTO,
    AuthControllerResponseDTO,
    AuthResponseDTO,
    GoogleAuthDTO,
    UserLoginDTO,
} from "../types/auth/auth.js";
import {
    UserLoginGoogleSchema,
    UserCreateSchema,
    UserLoginSchema,
} from "./auth.schema.js";

interface IAuthModel {
    register(userData: UserRegisterDTO): Promise<AuthResponseDTO>;
    authWithGoogle(userData: GoogleAuthDTO): Promise<AuthResponseDTO>;
    login(userData: UserLoginDTO): Promise<AuthResponseDTO>;
}

export class AuthController {
    private authModel: IAuthModel;

    constructor({ authModel }) {
        this.authModel = authModel;
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedUser = UserCreateSchema.parse(req.body);

            const userData: UserRegisterDTO = {
                email: validatedUser.email,
                password: validatedUser.password,
            };

            const newUser = await this.authModel.register(userData);

            const response: AuthControllerResponseDTO = {
                token: newUser.token,
            };
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    authWithGoogle = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const validatedUser = UserLoginGoogleSchema.parse(req.body);

            const userData: GoogleAuthDTO = {
                uid: validatedUser.uid,
                email: validatedUser.email,
            };

            const user = await this.authModel.authWithGoogle(userData);

            const response: AuthControllerResponseDTO = {
                token: user.token,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedUser = UserLoginSchema.parse(req.body);

            const userData: UserLoginDTO = {
                email: validatedUser.email,
                password: validatedUser.password,
            };

            const user = await this.authModel.login(userData);

            const response: AuthControllerResponseDTO = {
                token: user.token,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}
