import { ModelError } from "./modelError.js";

export function throwModelError(message, code) {
    throw new ModelError(message, code);
}