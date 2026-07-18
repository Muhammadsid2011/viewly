import UserRepository from '../repositories/user.repository';
import { CreateUserDto, LoginUserDto } from '../types/user.types';
import { ApiError } from '../utils/ApiError';

class UserService{
    static async register(data: CreateUserDto) {
        const exsistingUser = await UserRepository.findByEmailOrUsername(data.email, data.username);
        if (exsistingUser) {
            throw new ApiError(409,"Email or username already exsists");
        }
    
        const user = await UserRepository.create(data);
    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        await UserRepository.updateRefreshToken(
            user.id,
            refreshToken
        );
    
        const createdUser = await UserRepository.findById(user.id);
    
        return {
            user: createdUser,
            accessToken,
            refreshToken,
        };
    }
    
    static async login(data: LoginUserDto) {
        const user = await UserRepository.findByEmailOrUsername(data.email);
    
        if (!user) {
            throw new ApiError(401,"Invalid email or password")
        }
        const isPasswordCorrect = await user.isPasswordCorrect(data.password)
    
        if (!isPasswordCorrect) {
            throw new ApiError(401,"Invalid email or password")
        }
    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        await UserRepository.updateRefreshToken(user.id, refreshToken);
    
        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    static async logout(id: string){
        await UserRepository.unsetRefreshToken(id);
    }

}

export default UserService;