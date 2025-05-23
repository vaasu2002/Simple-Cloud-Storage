export class GenericApiError extends Error{
    public statusCode: number;
    public errorName: string;
    public errorMessage: string;
    public errorExplanation: string;
    constructor(statusCode: number, errorName: string, errorMessage: string,errorExplanation: string='') {
        super(errorMessage);
        this.statusCode = statusCode;
        this.errorName = errorName;
        this.errorMessage = errorMessage;
        this.errorExplanation = errorExplanation;
    }
}
export default GenericApiError;