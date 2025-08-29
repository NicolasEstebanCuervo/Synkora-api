export interface UserRegisterDTO {
    email: string;
    password: string;
}

export interface UserLoginDTO {
    email: string;
    password: string;
}

export interface GoogleAuthDTO {
    uid: string;
    email: string;
}

export interface AuthResponseDTO {
    uid: string;
    token: string;
}

export interface AuthControllerResponseDTO {
    token: string;
}