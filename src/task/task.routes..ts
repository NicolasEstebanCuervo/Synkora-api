import { Router } from "express";
import { TaskController } from "./task.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const createTaskRouter = ({ taskModel }) => {
    const taskRouter = Router();
    const taskController = new TaskController({ taskModel });

    taskRouter.get("/", authMiddleware, taskController.getAll);
    taskRouter.post("/", authMiddleware, taskController.create);
    taskRouter.patch("/:id", authMiddleware, taskController.toggleTaskStatus);
    taskRouter.delete("/:id", authMiddleware, taskController.delete);

    return taskRouter;
};
