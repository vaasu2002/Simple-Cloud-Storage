import { StatusCodes } from 'http-status-codes';
import GenericError from './genericApi.errors';

export class BadRequestError extends GenericError {
    constructor(errorExplanation: string) {
        super(StatusCodes.BAD_REQUEST,'BAD_REQUEST_ERROR', '',errorExplanation);

    }
}