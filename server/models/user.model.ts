import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { IUser } from "../types/user.types"

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            match: [/^[a-z0-9_]+$/, "Invalid username"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
            default: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBBAcCA//EADoQAAIBAgIFCQUGBwAAAAAAAAABAgMEBREGITFBURITImFxgaGx0RRCcpHBIzJDUmLhFTNEY3Oi8P/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A6kADTIAAAAAAAAACgAAAAAAAgAAAAAAAAAAAAAAAAAAAAABG4rjdnhnQrT5dbLNUYa5d/A1tJsa/hlBUrdx9rqfd38hcfQoNScqk5TqSc5yecpS1tsuCwXOmF/Ub9np0aMNya5bXz1eB8aelmLQecp0anVKkl5ZEGCpV3w3S62uJKnfU1byfvp5wz+hY01KKlFqUWs0080zkvdrLBozjs7GrG1up52s3knL8N+gVewPIEAAEAAAAAAAAAAAAAAAAA81akKNKdSo+hCPKk+pbT0ROlVZ0cBuctsuTDucln4ZgUPEbud/e1bqptqS1Lgty+RrAGkAAAHkABf8ARG/d5hnNVJZ1LfoZ/p91k4UbQas4YpWo7qlFvvTXqy8kUABAAAAAAAAAAAAAAAAAIXTFN4BW6pwf+2RNGjjlB3WEXdGKzk6bcV1rWvIo5kBv2AqAAAAACe0Ji3jea3UZZ/NF9KfoHby527umtSiqcX4vyRcOwigAIAAAAAAAAAAAAAAAAAAA5zpJhrw3EZqKfMVenSfVvXcyKOo4hY0MQtpW9zDOL1prbF8UUjEtGr+zk3Sh7TSWyVNa8utehpIhQZknB5TTi1tUlk0YzXFADMISqTjCnFynJ5JLezbssLvb6SVvbVJR/O1lFd7LngGj1PDGrivNVrrLJNLow7PUDdwPD/4bh1O3eXOfeqNfme3/ALqN8AigAIAAAAAAAAAAAAAAAAAA7136gA3kPiGkmHWUnBVefqLbGk88u17EQN1pleTbVrb0aS3Oecn9EUXScFNdOEZLrWZ5jQoQecKNKL/TBI59U0jxef8AVOPwxS+h4jpBi0Xn7bUfakxB0h5vJvcN5QaGlmJ0n9pzFZf3Ia/BombLTC1q5RvKM6En70elH1AsoPlb3NC6p85b1oVIcYPNfsfUgAAAAAAAAAAAAAAAAAGnimIUcMs5XFfXujBPXOXAo9YliFvhtu61zPJbIxW2T4IouMaQXeJcqHK5m3f4UHt+J7zRxG+r4jcyuLmWcnsW6K4JGsWIbAAAAAAAAbFneXFlVVS1qunLq2S7UXXAtI6OI8mhdZUrrLV+Wp2ehQjKeTTW1ArrQK3otj8rxRsb2edwl9nN/idvWWQigAIAAAAAAAAAAKMSkoxcm0klm29xzjH8Ulid+5xb5iGcaUeC495adMb72XDVbwfTuXyevkrb9EUMuJoAAAAAAAAAAAAAzCcoTjOE5QmnmpJ60+J0jAcTWKWEaryVaD5NVJZZS/c5sTWiV97Hi0Kc3lSuPs5dvu+PmDHQQOAMqAAAAAAAAAADn+mFy7jGZwX3aEVBLr2vz8CENnEarrYhc1Hr5VaT8TWNJoAAAAAAAAAAAAAGU2mmnk1rT4MwAOqWFwruyoXGWXOQUmuD3n3IXRCo6mB0U3rjKUfEmjKgAAAAAAABhgAcoq/zanxs8AGkAAAAAAAAAAAAAAAAXvQjXg8v80vJFgAMqAAAAAP/2Q=="
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false
        },
        refreshToken: {
            type: String,
            select: false
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"]
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"]
        }
    )
}

const User: Model<IUser> = mongoose.model("User", userSchema);
export default User;