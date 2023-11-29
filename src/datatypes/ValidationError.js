export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name="ValidationError";
    }
};

export class TooShortValidationError extends ValidationError {
    constructor() {
        super(`Missing any text content; provide at least one letter or digit`)
        this.name="TooShortValidationError";
    }
}

export class TooLongValidationError extends ValidationError {
    constructor() {
        super(`Too much text content — ensure content is a 1,024 letters or fewer.`)
        this.name="TooLongValidationError";
    }
}
