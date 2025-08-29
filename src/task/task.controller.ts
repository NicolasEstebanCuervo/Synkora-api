import { Request, Response } from "express";
import {
    TaskCreateDTO,
    TaskControllerResponseDTO,
    TaskResponseDTO,
    TaskUpdateStatusDTO,
    TaskListResponseDTO,
} from "../types/task/task.js";
import { NextFunction } from "express-serve-static-core";
import { TaskCreateSchema, TaskUpdateSchema } from "./task.schema.js";

interface ITaskModel {
    getAllByUserId: (uid: string) => Promise<TaskListResponseDTO>;
    create: (uid: string, taskData: TaskCreateDTO) => Promise<TaskResponseDTO>;
    delete: (uid: string, taskId: string) => Promise<void>;
    toggleTaskStatus: (
        uid: string,
        taskId: string,
        taskData: TaskUpdateStatusDTO
    ) => Promise<void>;
}

interface AuthenticatedRequest extends Request {
    user: { uid: string };
}

export class TaskController {
    private taskModel: ITaskModel;

    constructor({ taskModel }) {
        this.taskModel = taskModel;
    }

    getAll = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const uid = req.user.uid;
            const tasks = await this.taskModel.getAllByUserId(uid);

            const response: TaskControllerResponseDTO = {
                tasks: tasks,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    create = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const uid = req.user.uid;

            const validatedTask = TaskCreateSchema.parse(req.body);

            const taskData: TaskCreateDTO = {
                title: validatedTask.title,
                description: validatedTask.description,
            };

            const newTask = await this.taskModel.create(uid, taskData);
            const response: TaskControllerResponseDTO = {
                task: newTask,
            };

            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    delete = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const uid = req.user.uid;
            const { id } = req.params;
            await this.taskModel.delete(uid, id);

            return res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    };

    toggleTaskStatus = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const uid = req.user.uid;
            const { id } = req.params;

            const validatedTask = TaskUpdateSchema.parse(req.body);

            const taskData: TaskUpdateStatusDTO = {
                completed: validatedTask.completed,
            };

            await this.taskModel.toggleTaskStatus(uid, id, taskData);

            return res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    };
}
