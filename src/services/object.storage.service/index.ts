import { ObjectManager } from './ObjectManager';
import { DeduplicationService } from './DeduplicationService';
import { VersioningService } from './VersioningService';
import { generateSnowflakeId, unlink } from '../../utils';
import { StorageObject, Bucket } from '../../models';
import { DTOuploadFile } from '../../dtos';
import {ObjectStorageRepository} from '../../repositories'

export class StorageService{
    private objectManager = new ObjectManager();
    private dedupService = new DeduplicationService();
    private versionService = new VersioningService();
    private objectStorageRepository: ObjectStorageRepository;

    constructor(){
        this.objectStorageRepository = new ObjectStorageRepository(StorageObject);
        this.objectManager = new ObjectManager();
        this.dedupService = new DeduplicationService();
        this.versionService = new VersioningService();
    }

    public async uploadObject(data: DTOuploadFile) {
        const { file, userId, bucketId } = data;
        let { directory, tags, metadata } = data;
        const tempFilePath = file.path;
        const originalFilename = file.originalname;
        const logicalKey = (directory || '/') + originalFilename;

        const fileStats = await this.objectManager.getFileStats(tempFilePath);
        const contentHash = await this.objectManager.computeHash(tempFilePath);

        const existingObject = await this
                .objectStorageRepository
                .getObjectByLogicalKeyAndBucket(bucketId, logicalKey);
        
        const bucket = await Bucket.findById(bucketId);

        let physicalKey: string;
        
        const deduped = await this.dedupService.findByContentHash(contentHash);
        if(deduped){
            if(deduped.bucket.toString() === bucketId){
                throw new Error('Object already exists in a same bucket.');
            }
            /**
             * If the object already exists in a different bucket,
             * We will not save the object again, reuse the storage key.
             * Just create a new logical entity.
             */
            physicalKey = deduped.storageKey;
            await unlink(tempFilePath);
        }
        else{
            /** 
             * IF OBJECT IS NOT PRESENT IN THE STORAGE
             * Generate a unique physical key for the object.
             * Store the file in the physical storage
             */
            physicalKey = generateSnowflakeId();
            await this.objectManager.storeFile(
                tempFilePath, originalFilename, physicalKey
            );
        }
        if(existingObject){
            await this.versionService.createVersion(existingObject);

            existingObject.storageKey = physicalKey;
            existingObject.size = fileStats.size;
            existingObject.contentHash = contentHash;
            await existingObject.save();
            return existingObject;
        }

        const object = await this.objectStorageRepository.createObject({
            key: logicalKey,
            originalname: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            size: fileStats.size,
            storageKey: physicalKey,
            bucket: bucketId,
            owner: userId,
            accessLevel: bucket.accessLevel,
            contentHash,
            tags: tags ? JSON.parse(tags) : [],
            metadata: metadata ? JSON.parse(metadata) : {},
        });

        return object;
    }
}