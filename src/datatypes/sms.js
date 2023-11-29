import { ValidationError, TooLongValidationError ,TooShortValidationError } from "./ValidationError";

export class SmsValidationError extends ValidationError {
    constructor(str) {
        super(`"${str}" is not a valid SMS number.`)
        this.name="SmsValidationError";
    }
}

export const key = "sms";
export const label = "Text (SMS)";
export const placeholder = `Enter a phone number`;
export const example = "+15555551234";

export function normalize(str) {
    try {
        let returnValue = str.trim();
        if (returnValue.length < 1) { throw new TooShortValidationError(); }
        try {
            let url = new URL(returnValue);
        } catch {
            returnValue = `sms:${returnValue}`;
        }
        let url = new URL(returnValue);
        if (url.protocol !== "sms:" && url.protocol !== "smsto:")
            throw new SmsValidationError(url);
        if (returnValue.length > 1024) {
            throw new TooLongValidationError();
        }
        return returnValue;
    } catch (e) {
        throw new SmsValidationError(str);
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