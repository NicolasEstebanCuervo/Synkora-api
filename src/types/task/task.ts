export interface TaskCreateDTO {
    title: string;
    description: string;
}

export interface TaskUpdateStatusDTO {
    completed: boolean;
}

export interface TaskResponseDTO {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export type TaskListResponseDTO = TaskResponseDTO[];

export interface TaskControllerResponseDTO {
    task?: TaskResponseDTO;
    tasks?: TaskResponseDTO[];
}
