import { throwModelError } from "../errors/throwModelError.js";
import { db } from "../firebase.js";
import {
    TaskCreateDTO,
    TaskListResponseDTO,
    TaskResponseDTO,
    TaskUpdateStatusDTO,
} from "../types/task/task.js";
import { TaskErrors } from "../types/task/taskErrors.js";

export class TaskModel {
    private static async getValidatedUserRef(uid: string) {
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throwModelError("User not found", TaskErrors.UserNotFound);
        }
        return userRef;
    }

    static async getAllByUserId(uid: string): Promise<TaskListResponseDTO> {
        try {
            let userRef;

            try {
                userRef = await this.getValidatedUserRef(uid);
            } catch (err) {
                return [];
            }

            const tasksSnapshot = await userRef.collection("tasks").get();

            return tasksSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<TaskResponseDTO, "id">),
            }));
        } catch (error) {
            switch (error.code) {
                case "permission-denied":
                    throwModelError(
                        "Permission denied",
                        TaskErrors.PermissionDenied
                    );
                    break;
                default:
                    throwModelError(
                        "An unexpected error occurred while fetching tasks",
                        TaskErrors.UnexpectedError
                    );
            }
        }
    }

    static async create(
        uid: string,
        taskData: TaskCreateDTO
    ): Promise<TaskResponseDTO> {
        try {
            const userRef = await this.getValidatedUserRef(uid);

            const taskRecord = {
                title: taskData.title,
                description: taskData.description,
                completed: false,
            };

            const docRef = await userRef.collection("tasks").add(taskRecord);

            return {
                id: docRef.id,
                ...taskRecord,
            };
        } catch (error) {
            switch (error.code) {
                case "permission-denied":
                    throwModelError(
                        "Permission denied",
                        TaskErrors.PermissionDenied
                    );
                    break;
                default:
                    throwModelError(
                        "An unexpected error occurred while creating the task",
                        TaskErrors.UnexpectedError
                    );
            }
        }
    }

    static async delete(uid: string, taskId: string): Promise<void> {
        try {
            const userRef = await this.getValidatedUserRef(uid);

            const taskRef = userRef.collection("tasks").doc(taskId);
            const taskDoc = await taskRef.get();

            if (!taskDoc.exists) {
                throwModelError("Task not found", TaskErrors.TaskNotFound);
            }

            await taskRef.delete();
        } catch (error) {
            switch (error.code) {
                case "permission-denied":
                    throwModelError(
                        "Permission denied",
                        TaskErrors.PermissionDenied
                    );
                    break;
                default:
                    throwModelError(
                        "An unexpected error occurred while deleting the task",
                        TaskErrors.UnexpectedError
                    );
            }
        }
    }

    static async toggleTaskStatus(
        uid: string,
        taskId: string,
        taskData: TaskUpdateStatusDTO
    ): Promise<void> {
        try {
            const userRef = await this.getValidatedUserRef(uid);

            const taskRef = userRef.collection("tasks").doc(taskId);
            const taskDoc = await taskRef.get();

            if (!taskDoc.exists) {
                throwModelError("Task not found", TaskErrors.TaskNotFound);
            }

            await taskRef.update({
                completed: taskData.completed,
            });

        } catch (error) {
            switch (error.code) {
                case "permission-denied":
                    throwModelError(
                        "Permission denied",
                        TaskErrors.PermissionDenied
                    );
                    break;
                default:
                    throwModelError(
                        "An unexpected error occurred while updating the task",
                        TaskErrors.UnexpectedError
                    );
            }
        }
    }
}
