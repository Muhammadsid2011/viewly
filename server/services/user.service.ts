import { uploadOncloudinary } from '../config/cloudinary';
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
        const user = await UserRepository.findByEmailOrUsername(data.email)?.select("+password");
    
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
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                accessToken,
                refreshToken,
            },
            accessToken,
            refreshToken,
        };
    }

    static async logout(id: string){
        await UserRepository.unsetRefreshToken(id);
    }

    static async changePassword(id: string, oldPassword: string, newPassword: string) {
        const user = await UserRepository.findById(id).select("+password");
        const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect){
            throw new ApiError(401, "Old password is incorrect");
        }

        const updatedUser = await UserRepository.updatePassword(id, newPassword);
        await updatedUser?.save();
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

        const avatar = await uploadOncloudinary(avatarLocalUrl);

        if (!avatar?.url) {
            throw new ApiError(500, "Failed to upload avatar");
        }

        const user = await UserRepository.updateAvatar(id, avatar.url);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        return user;
    }
    static async updateUserCoverImage(id: string, coverImageUrl: string) {
        const coverImage = await uploadOncloudinary(coverImageUrl);

        if (!coverImage?.url) {
            throw new ApiError(500, "Failed to upload cover image");
        }

        const user = await UserRepository.updateCoverImage(id, coverImage.url);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        return user;
    }
    static async getUserChannelProfile(userId: string, channelUsername: string) {
        const channel = await UserRepository.getChannelProfileById(userId, channelUsername);
        if(!channel || channel.length === 0){
            throw new ApiError(404, "Channel not found")
        }
        return channel;
    }
    static async getUserWatchHistory(userId: string) {
        const user = await UserRepository.getWatchHistory(userId);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        return user.watchHistory;
    }
}

export default UserService;