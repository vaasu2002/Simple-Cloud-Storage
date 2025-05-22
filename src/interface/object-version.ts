export interface IObjectVersion {
    versionId: string;
    storageKey: string;
    size: number;
    createdAt: Date;
    metadata?: Record<string, any>;
}