export interface IApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    error?: any;
}