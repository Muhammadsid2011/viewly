import mongoose from "mongoose";

export interface IUser {
    _id: mongoose.Types.ObjectId;
    watchHistory: mongoose.Types.ObjectId[];
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage?: string;
    password: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
export interface CreateUserDto {
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage?: string;
    password: string;
}

export interface UpdateUserProfileDto {
    email: string;
    username: string;
}

export interface LoginUserDto{
    email: string;
    password: string;
}