import { StorageObject } from '../../models';

export class DeduplicationService{
    public async findByContentHash(contentHash: string) {
        return StorageObject.findOne({ contentHash });
    }

    public async fileAlreadyExists(contentHash: string): Promise<boolean> {
        const existing = await this.findByContentHash(contentHash);
        return !!existing;
    }
}
