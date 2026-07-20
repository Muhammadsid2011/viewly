import UserRepository from '../repositories/user.repository';
import { CreateUserDto, LoginUserDto, UpdateUserProfileDto } from '../types/user.types';
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

    static async changePassword(id: string, oldPassword: string, newPassword: string) {
        const user = await UserRepository.findById(id);
        const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect){
            throw new ApiError(401, "Old password is incorrect");
        }

        await UserRepository.updatePassword(id, newPassword);
    }
    static async getCurrentUser(id: string) {
        const user = await UserRepository.findById(id);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        return user;
    }

    static async updateUserProfile(id: string, data: Partial<UpdateUserProfileDto>) {
        const user = await UserRepository
        .findByIdAndUpdateUsernameAndEmail(id, data.email, data.username);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        return user;
    }
    static async updateUserAvatar(id: string, avatarLocalUrl: string) {
        const user = await UserRepository.updateAvatar(id, avatarLocalUrl);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        return user;
    }
    static async updateUserCoverImage(id: string, coverImageUrl: string) {
        const user = await UserRepository.updateCoverImage(id, coverImageUrl);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        return user;
    }
}

export default UserService;