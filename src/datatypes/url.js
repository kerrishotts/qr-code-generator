import { ValidationError, TooLongValidationError } from "./ValidationError";

export class UrlValidationError extends ValidationError {
    constructor(url) {
        super(`"${url}" is not a valid URL. Be sure to include the correct protocol, such as "https:" or "sms:".`)
        this.name="UrlValidationError";
    }
}

export const key = "url";
export const label = "URL";
export const placeholder = `Enter a URL`;
export const example = "https://www.example.com";

export function normalize(str) {
    try {
        let url = new URL(str);
        let returnValue = url.toString();
        if (returnValue.length > 1024) {
            throw new TooLongValidationError();
        }
        return returnValue;
    } catch (e) {
        throw new UrlValidationError(str);
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