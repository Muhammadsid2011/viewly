import mongoose from "mongoose";
import User from "../models/user.model";
import { CreateUserDto } from "../types/user.types";

class UserReposiitory {
    static findByEmailOrUsername(email?: string, username?: string) {
        const conditions = [];

        if (email) conditions.push({ email });
        if (username) conditions.push({ username });

        if (conditions.length === 0) return null;

        return User.findOne({
            $or: conditions
        });
    }
    static findByIdAndUpdateUsernameAndEmail(
        id: string,
        email?: string,
        username?: string
    ) {
        const update: Record<string, string> = {};

        if (email) update.email = email;
        if (username) update.username = username;

        if (Object.keys(update).length === 0) {
            return null;
        }

        return User.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        );
    }

    static create(data: CreateUserDto) {
        return User.create(data)
    }
    static findById(id: string) {
        return User.findById(id)
    }
    static async updateRefreshToken(id: string, token: string) {
        const user = await User.findById(id).select("+refreshToken");

        if (!user) {
            throw new Error("User not found");
        }

        user.refreshToken = token;
        await user.save({ validateBeforeSave: false });

        return user;
    }
    static unsetRefreshToken(id: string) {
        return User.findByIdAndUpdate(id, {
            $unset: {
                refreshToken: 1
            },
        },
            {
                new: true
            }
        )
    }
    static async updatePassword(id: string, newPassword: string) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        user.password = newPassword;
        await user.save();

        return user;
    }
    static updateAvatar(id: string, avatarUrl: string) {
        return User.findByIdAndUpdate(id, {
            avatar: avatarUrl
        }, {
            new: true
        })
    }
    static updateCoverImage(id: string, coverImageUrl: string) {
        return User.findByIdAndUpdate(id, {
            coverImage: coverImageUrl
        }, {
            new: true
        })
    }
    static async getChannelProfileById(userId: string, channelUsername: string) {
        const channel = await User.aggregate([
            {
                $match: {
                    username: channelUsername
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [userId, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1

                }
            }
        ])
        return channel[0];
    }
    static getWatchHistory(id: string){
        return User.findById(id).populate("watchHistory");
    }
}

export default UserReposiitory;