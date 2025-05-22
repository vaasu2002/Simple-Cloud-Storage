import { Model } from 'mongoose';
import { IUserDocument } from '../interface';
import { DTORegsiterUserData } from '../dtos';

export class UserRepository{
    private model:Model<IUserDocument>;
    public constructor(model:Model<IUserDocument>){
        this.model = model;
    }
    async findUserByEmailOrUserName(username:string|null,email:string|null){
        try{
            if(!username && !email){
                throw new Error('username/email does not exsits')
            }
            const user = await this.model.findOne({
                $or: [{ email }, { username }],
            });
            return user;
        }catch(err){
            throw err;
        }
    }

    async createUser(data:DTORegsiterUserData){
        try{
            if(!data.username || !data.email || !data.password){
                throw new Error('username/email/password does not exsits')
            }
            const user = await this.model.create(data);
            return user;
        }catch(err){
            throw err;
        }
    }
}