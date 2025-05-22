export interface ISearchQuery {
    filename?: string;
    mimetype?: string;
    size?: {
        min?: number;
        max?: number;
    };
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt?: {
        from?: Date;
        to?: Date;
    };
}

export interface IUploadResponse {
    id: string;
    filename: string;
    originalname: string;
    size: number;
    bucket: string;
    path: string;
    contentHash: string;
    versionId: string;
}