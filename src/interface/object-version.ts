export interface IObjectVersion {
    versionId: number;
    storageKey: string;
    size: number;
    createdAt: Date;
    metadata?: Record<string, any>;
}