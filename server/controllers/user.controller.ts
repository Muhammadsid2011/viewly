import type { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { cookieOptions } from "../config/cookies";
import { ApiError } from "../utils/ApiError";
import UserReposiitory from "../repositories/user.repository";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.login(req.body);

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200)
            .cookie("accessToken", result.accessToken, cookieOptions)
            .cookie("refreshToken", result.refreshToken, cookieOptions)
            .json({
                success: true,
                data: result
            });
    } catch (error) {
        next(error)
    }
}

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.register(req.body);

        return res.status(201)
            .cookie("accessToken", result.accessToken, cookieOptions)
            .cookie("refreshToken", result.refreshToken, cookieOptions)
            .json({
                success: true,
                data: result,
            });
    } catch (error) {
        next(error);
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserService.logout(req.user._id)

        return res.status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json({ message: "User logged out successfully" })

    } catch (error) {
        next(error)
    }
}

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await UserService.changePassword(req.user._id, oldPassword, newPassword)

        return res.status(200).json({ message: "password changed successfully" })
    } catch (error) {
        res.status(400).json({ message: (error as Error).message })
        next(error)
    }
}

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const incomingRefreshToken: string = req.cookies?.refreshToken;


        if (!incomingRefreshToken) {
            throw new ApiError(401, "Refresh token missing");
        }


        const decoded: any = jwt.verify(
            incomingRefreshToken,
            env.REFRESH_TOKEN_SECRET
        );

        if (typeof decoded === "string") {
            throw new ApiError(401, "Invalid token");
        }

        const user = await UserReposiitory.findById(decoded._id).select("+refreshToken");


        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }


        if (
            user.refreshToken !== incomingRefreshToken
        ) {
            throw new ApiError(401, "Refresh token expired or reused");
        }


        const newAccessToken =
            user.generateAccessToken();


        const newRefreshToken =
            user.generateRefreshToken();


        user.refreshToken = newRefreshToken;

        await user.save({
            validateBeforeSave: false
        });


        return res.cookie(
            "accessToken",
            newAccessToken,
            cookieOptions
        ).cookie(
            "refreshToken",
            newRefreshToken,
            cookieOptions
        )
            .json({
                message: "Token refreshed"
            });


    } catch (error) {

        next(error);

    }
};

const getCurrentUser = async (req: Request, res: Response) => {
   const user = await UserService.getCurrentUser(req.user._id);
   return res.status(200).json({
       success: true,
       data: user
   }) 
}

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.updateUserProfile(req.user._id, req.body);
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const user = await UserService.updateUserAvatar(req.user._id, req.files?.avatar[0]?.path);
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

const updateUserCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const user = await UserService.updateUserCoverImage(req.user._id, req.files?.coverImage[0]?.path);
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

const getUserChannelProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { channelUsername } = req.params;
        const channel = await UserService.getUserChannelProfile(req.user._id, channelUsername as string);
        return res.status(200).json({
            success: true,
            data: channel
        });
    }catch (error) {
        next(error);
    }
}

export {
    login,
    register,
    refreshAccessToken,
    logout,
    changePassword,
    getCurrentUser,
    updateUserProfile,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile
}