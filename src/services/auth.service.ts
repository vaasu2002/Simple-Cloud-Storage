import { User } from '../models';
import { UserRepository } from '../repositories';
import { generateToken } from '../utils';
import { 
    DTORegsiterUserData,
    DTOreturnLoginUserData,
    DTOreturnRegsiterUserData 
} from '../dtos';

class AuthService{
    private userRepository:UserRepository;
    public constructor(){
        this.userRepository = new UserRepository(User)
    }
    public async register(regsiterUserData:DTORegsiterUserData):Promise<DTOreturnRegsiterUserData>{
        try{
            const { username, email, password } = regsiterUserData;
            if(!username || !email || !password){
                throw new Error('ERRCODE2');
            }
            const existingUser = await this.userRepository.findUserByEmailOrUserName(username,email);
            if(existingUser){
                throw new Error('ERRCODE1');
            }
            const user = await this.userRepository.createUser(regsiterUserData)

            const token = generateToken(user);

            return {user,token};
        }catch(err){
            console.error('Registration error:', err);
            throw err;
        } 
    }

    public async login(loginUserData:{email:string,password:string}):Promise<DTOreturnLoginUserData>{
        try{
            const { email, password } = loginUserData;
            const user = await this.userRepository.findUserByEmailOrUserName('',email);
            if(!user){
                throw new Error('ERRCODE3');
            }
            const isMatch = await user.comparePassword(password);
            if(!isMatch){
                throw new Error('ERRCODE4');
            }
            const token = generateToken(user);
            return {user,token};
        }catch(err){
            console.log('login error: ', err)
            throw err;
        }
    }
}

export const authService = new AuthService();