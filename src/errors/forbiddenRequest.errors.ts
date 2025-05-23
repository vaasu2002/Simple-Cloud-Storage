import { StatusCodes } from 'http-status-codes';
import GenericError from './genericApi.errors';

export class ForbiddenRequestError extends GenericError {
    constructor(errorExplanation: string) {
        super(StatusCodes.FORBIDDEN,'FORBIDDEN_REQUEST_ERROR','',errorExplanation);
    }
}