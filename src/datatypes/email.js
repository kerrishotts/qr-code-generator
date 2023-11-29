import { ValidationError, TooLongValidationError ,TooShortValidationError } from "./ValidationError";

export class EmailValidationError extends ValidationError {
    constructor(str) {
        super(`"${str}" is not a valid email.`)
        this.name="EmailValidationError";
    }
}

export const key = "mailto";
export const label = "Email";
export const placeholder = `Enter an email`;
export const example = "hello@example.com";

export function normalize(str) {
    try {
        let returnValue = str.trim();
        if (returnValue.length < 1) { throw new TooShortValidationError(); }
        try {
            let url = new URL(returnValue);
        } catch {
            returnValue = `mailto:${returnValue}`;
        }
        let url = new URL(returnValue);
        if (url.protocol !== "mailto:")
            throw new EmailValidationError(url);
        if (returnValue.length > 1024) {
            throw new TooLongValidationError();
        }
        return returnValue;
    } catch (e) {
        throw new EmailValidationError(str);
    }
}
export function valid(str) {
    try {
        normalize(str);
        return true;
    } catch (e) {
        return false;
    }
}