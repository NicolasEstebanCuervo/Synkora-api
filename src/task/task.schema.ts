import { z } from "zod";

export const TaskCreateSchema = z.object({
    title: z
        .string({ message: "Invalid email address" })
        .min(5, { message: "Password must be at least 10 characters" })
        .max(50, { message: "Password must be under 50 characters" }),
    description: z
        .string()
        .min(5, { message: "Password must be at least 10 characters" })
        .max(100, { message: "Password must be under 50 characters" }),
});

export const TaskUpdateSchema = z.object({
    completed:  z.boolean(),
});