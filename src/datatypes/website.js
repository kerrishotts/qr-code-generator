import { ValidationError, TooLongValidationError } from "./ValidationError";

export class WebsiteValidationError extends ValidationError {
    constructor(url) {
        super(`"${url}" is not a valid website address. Be sure to include the correct protocol, such as "http:" or "https:".`)
        this.name="WebsiteValidationError";
    }
}

export const key = "website";
export const label = "Website address";
export const placeholder = `Enter a website address`;
export const example = "https://www.example.com";

export function normalize(str) {
    try {
        let url = new URL(str);
        if (url.protocol !== "http:" && url.protocol !== "https:")
            throw new WebsiteValidationError(url);
        if (!url.href.startsWith(`${url.protocol}//`))
            throw new WebsiteValidationError(url);
        const returnValue = url.toString();
        if (returnValue.length > 1024) {
            throw new TooLongValidationError();
        }
        return returnValue;
    } catch (e) {
        throw new WebsiteValidationError(str);
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