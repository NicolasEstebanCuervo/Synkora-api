import express, { json } from "express";
import { corsMiddleware } from "./middleware/cors.js";
import dotenv from "dotenv";
import { createTaskRouter } from "./task/task.routes..js";
import { AuthModel } from "./auth/auth.model.js";
import { TaskModel } from "./task/task.model.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createAuthRouter } from "./auth/auth.routes.js";

dotenv.config();
const app = express();
app.use(json());
app.use(corsMiddleware());
const PORT = process.env.PORT ?? 1234;

app.use("/auth", createAuthRouter({ authModel: AuthModel }));
app.use("/tasks", createTaskRouter({ taskModel: TaskModel }));
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});
