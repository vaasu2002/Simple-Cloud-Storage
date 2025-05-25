export type DTOuploadFile = {
  file: any,
  userId: string,
  bucketId: string,
  directory: string,
  tags: string,
  metadata: any,
}
export class CreateObjectDtoRepo{
  key: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  storageKey: string;
  bucket: string;
  owner: string;
  accessLevel: string;
  contentHash: string;
  tags: string[]; // assuming array of strings
  metadata: Record<string, any>; // assuming metadata is a flat object with arbitrary keys/values
}