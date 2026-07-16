import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import  User  from "../models/user.model";
import { env } from "../config/env";


interface JwtPayload {
  _id: string;
  email: string;
  username: string;
  fullName: string;
}

export const verifyJWT = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {

    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }


    const decoded =
      jwt.verify(
        token,
        env.ACCESS_TOKEN_SECRET
      ) as JwtPayload;


    const user = await User.findById(decoded._id)
      .select("-password -refreshToken");


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }


    req.user = user;


    next();


  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });

  }
};