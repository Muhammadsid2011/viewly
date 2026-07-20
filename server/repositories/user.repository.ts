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
    static updateRefreshToken(id: string, token: string) {
        return User.findByIdAndUpdate(id, {
            refreshToken: token
        },
            {
                new: true
            });
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
    static updatePassword(id: string, newPassword: string) {
        return User.findByIdAndUpdate(id, {
            password: newPassword
        })
    }
    static updateAvatar(id: string, avatarUrl: string) {
        return User.findByIdAndUpdate(id, {
            avatar: avatarUrl
        }, {
            new: true
        })
    }
}

export default UserReposiitory;