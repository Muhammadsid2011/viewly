import UserRepository from '../repositories/user.repository';
import { CreateUserDto, LoginUserDto } from '../types/user.types';

class UserService{
    static async register(data: CreateUserDto) {
        const exsistingUser = await UserRepository.findByEmailOrUsername(data.email, data.username);
        if (exsistingUser) {
            throw new Error("Email or username already exsists");
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
            throw new Error("Invalid email or password")
        }
        const isPasswordCorrect = await user.isPasswordCorrect(data.password)
    
        if (!isPasswordCorrect) {
            throw new Error("Invalid email or password")
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

}

export default UserService;