import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { copyFile, unlink, stat } from '../../utils';
import { configs } from '../../config';

export class ObjectManager{
    private basePath = configs.storage.path;
    
    constructor(){
        if(!fs.existsSync(this.basePath)){
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }

    /**  
     * returns objects Disk Store Path
     * where the object will be stored physically
    */
    public getPhyscialStoragePath(
        objectName: string, uniqueId: string): string {
            
        const physicalStoragePath = `${uniqueId}${path.parse(objectName).ext}`;
        return path.join(this.basePath, physicalStoragePath);
    }

    public async storeFile(
        tempPath: string, originalName: string, 
        uniqueId: string){

        const physicalStoragePath = this.getPhyscialStoragePath(
            originalName, uniqueId
        );
        await copyFile(tempPath, physicalStoragePath);
        await unlink(tempPath);
    }

    /** Computes the SHA-256 hash of a object.
     * @param filePath - The path to the file for which the hash is to be computed.
     * @returns A promise that resolves to the SHA-256 hash of the object.
     */
    public async computeHash(objectPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(objectPath);
            stream.on('error', reject);
            stream.on('data', chunk => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
        });
    }

    public async getFileStats(objectPath: string) {
        return stat(objectPath);
    }
}
