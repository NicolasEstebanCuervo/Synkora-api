import { AuthErrors } from "../types/auth/authErrors.js";
import { TaskErrors } from "../types/task/taskErrors.js";

const errorMap: Record<string, number> = {
    // Auth errors
    [AuthErrors.EmailAlreadyExists]: 409,
    [AuthErrors.InvalidPassword]: 400,
    [AuthErrors.EmailNotFound]: 404,
    [AuthErrors.InvalidEmail]: 400,
    [AuthErrors.InvalidUid]: 400,
    [AuthErrors.EmailMissing]: 400,
    [AuthErrors.PasswordMissing]: 400,
    [AuthErrors.UidMissing]: 400,
    [AuthErrors.InvalidLoginCredentials]: 401,
    [AuthErrors.TokenMissing]: 401,
    [AuthErrors.InvalidToken]: 401,
    [AuthErrors.UnexpectedError]: 500,

    // Task errors
    [TaskErrors.TaskNotFound]: 404,
    [TaskErrors.TaskAlreadyExists]: 409,
    [TaskErrors.NotFound]: 404,
    [TaskErrors.PermissionDenied]: 403,
    [TaskErrors.UserNotFound]: 404,
    [TaskErrors.UnexpectedError]: 500,
};

export const errorHandler = (err, req, res, next) => {
    const status = errorMap[err.code] || 500;

    res.status(status).json(err.message || "Internal server error");
};
