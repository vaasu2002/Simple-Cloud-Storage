import { BucketAccessLevel } from "../interface"

export type DTOCreateBucketData = {
    name:string,
    userId:string,
    accessLevel:BucketAccessLevel
}