import type { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import  jwt from "jsonwebtoken";
import { env } from "../config/env";
import User from "../models/user.model";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = UserService.login(req.body);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ error })
        next(error)
    }
}

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.register(req.body);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({ error })
        next(error);
    }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const incomingRefreshToken: string = req.cookies?.refreshToken;


        if (!incomingRefreshToken) {
            throw new Error("Refresh token missing");
        }


        const decoded: any = jwt.verify(
            incomingRefreshToken,
            env.REFRESH_TOKEN_SECRET
        );


        const user = await User.findById(decoded._id);


        if (!user) {
            throw new Error("Invalid refresh token");
        }


        if (
            user.refreshToken !== incomingRefreshToken
        ) {
            throw new Error("Refresh token expired or reused");
        }


        const newAccessToken =
            user.generateAccessToken();


        const newRefreshToken =
            user.generateRefreshToken();


        user.refreshToken = newRefreshToken;

        await user.save({
            validateBeforeSave: false
        });


        res
            .cookie(
                "accessToken",
                newAccessToken,
                {
                    httpOnly: true,
                    secure: true
                }
            )
            .cookie(
                "refreshToken",
                newRefreshToken,
                {
                    httpOnly: true,
                    secure: true
                }
            )
            .json({
                message: "Token refreshed"
            });


    } catch (error) {

        next(error);

    }
};

export {
    login,
    register
}