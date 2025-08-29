import { z } from "zod";

export const UserCreateSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(10, { message: "Password must be at least 10 characters" })
        .max(50, { message: "Password must be under 50 characters" }),
});

export const UserLoginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const UserLoginGoogleSchema = z.object({
    uid: z.string(),
    email: z.email(),
});
