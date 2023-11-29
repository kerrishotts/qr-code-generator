import * as anyDataType from "./any";
import * as urlDataType from "./url";
import * as websiteDataType from "./website";
import * as smsDataType from "./sms";
import * as emailDataType from "./email";


function invalidReason(normalize, str) {
    try {
        normalize(str);
    } catch (err) {
        return err.message;
    }
}

export const dataTypes = {
    website: { ...websiteDataType, errorType: websiteDataType.WebsiteValidationError, invalidReason: invalidReason.bind(undefined, websiteDataType.normalize)},
    sms: { ...smsDataType, errorType: smsDataType.SmsValidationError, invalidReason: invalidReason.bind(undefined, smsDataType.normalize)},
    email: { ...emailDataType, errorType: emailDataType.EmailValidationError, invalidReason: invalidReason.bind(undefined, emailDataType.normalize)},
    url: { ...urlDataType, errorType: urlDataType.UrlValidationError, invalidReason: invalidReason.bind(undefined, urlDataType.normalize)},
    any: { ...anyDataType, errorType: anyDataType.AnyValidationError, invalidReason: invalidReason.bind(undefined, anyDataType.normalize)},
};

export const dataTypeKeys = Object.keys(dataTypes);