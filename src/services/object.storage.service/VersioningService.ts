import { IStorageObject, IObjectVersion } from '../../interface';
import { StorageObject } from '../../models';

export class VersioningService{
    public async createVersion(existingObject: IStorageObject){
        const version: IObjectVersion = {
            versionId: existingObject.versions.length + 1,
            storageKey: existingObject.storageKey,
            size: existingObject.size,
            createdAt: existingObject.updatedAt,
            metadata: existingObject.metadata,
        };

        await StorageObject.updateOne(
            { 
                _id: existingObject._id 
            },
            { 
                $push: { 
                    versions: 
                    version 
                } 
            }
        );
    }
}