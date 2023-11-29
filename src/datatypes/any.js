import { ValidationError, TooShortValidationError, TooLongValidationError } from "./ValidationError";

export class AnyValidationError extends ValidationError {
    constructor(msg) {
        super(msg)
        this.name="AnyValidationError";
    }
}


export const key = "any";
export const label = "Any content";
export const placeholder = "Enter some text content";
export const example = "";

export function normalize(text) {
    const trimmedText = text.trim();
    if (trimmedText.length < 1) {
        throw new TooShortValidationError();
    }
    if (trimmedText.length > 1024) {
        throw new TooLongValidationError();
    }
    return trimmedText;
}
export function valid(str) {
    try {
        normalize(str);
        return true;
    } catch (e) {
        return false;
    }
}