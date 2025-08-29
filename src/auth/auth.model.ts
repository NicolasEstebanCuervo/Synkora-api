import { ModelError } from "../errors/modelError.js";
import { throwModelError } from "../errors/throwModelError.js";
import { auth, db } from "../firebase.js";
import {
    AuthResponseDTO,
    GoogleAuthDTO,
    UserLoginDTO,
    UserRegisterDTO,
} from "../types/auth/auth.js";
import { AuthErrors } from "../types/auth/authErrors.js";

export class AuthModel {
    static async register(userData: UserRegisterDTO): Promise<AuthResponseDTO> {
        try {
            const userRecord = await auth.createUser({
                email: userData.email,
                password: userData.password,
            });

            await db.collection("users").doc(userRecord.uid).set({
                email: userData.email,
                createdAt: new Date(),
            });

            const customToken = await auth.createCustomToken(userRecord.uid);

            return { uid: userRecord.uid, token: customToken };
        } catch (error) {
            switch (error.code) {
                case "auth/email-already-exists":
                    throwModelError(
                        "Email already exists",
                        AuthErrors.EmailAlreadyExists
                    );
                    break;
                case "auth/invalid-email":
                    throwModelError("Invalid email", AuthErrors.InvalidEmail);
                    break;
                case "auth/invalid-password":
                    throwModelError(
                        "Invalid password",
                        AuthErrors.InvalidPassword
                    );
                    break;
                default:
                    throwModelError(
                        "An unexpected error occurred while creating user",
                        AuthErrors.UnexpectedError
                    );
            }
        }
    }

    static async authWithGoogle(
        userData: GoogleAuthDTO
    ): Promise<AuthResponseDTO> {
        try {
            const { uid, email } = userData;

            const userRef = db.collection("users").doc(uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                await userRef.set({
                    email,
                    createdAt: new Date(),
                });
            }

            const customToken = await auth.createCustomToken(uid);

            return { uid, token: customToken };
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-uid":
                    throwModelError("Invalid uid", AuthErrors.InvalidUid);
                    break;
                case "auth/invalid-email":
                    throwModelError("Invalid email", AuthErrors.InvalidEmail);
                    break;
                default:
                    throwModelError(
                        "An unexpected error occurred while creating Google user",
                        AuthErrors.UnexpectedError
                    );
            }
        }
    }

    static async login(userData: UserLoginDTO): Promise<AuthResponseDTO> {
        try {
            const credentials = {
                email: userData.email,
                password: userData.password,
            };

            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...credentials,
                        returnSecureToken: true,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const message = data?.error?.message;

                if (message === "INVALID_LOGIN_CREDENTIALS") {
                    throwModelError(
                        "Invalid credentials or user does not exist",
                        AuthErrors.InvalidLoginCredentials
                    );
                }

                throwModelError(message, AuthErrors.UnexpectedError);
            }

            const uid = data.localId;
            const customToken = await auth.createCustomToken(uid);

            return { uid, token: customToken };
        } catch (error) {
            if (error instanceof ModelError) throw error;

            throwModelError(
                "An unexpected error occurred while logging in",
                AuthErrors.UnexpectedError
            );
        }
    }
}
