import User from "../models/user.model";
import { CreateUserDto } from "../types/user.types";

class UserReposiitory {
    static findByEmailOrUsername(email?: string, username?: string) {
        const or = [];

        if (email) {
            or.push({ email });
        }

        if (username) {
            or.push({ username });
        }

        return User.findOne({ $or: or });
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
        });
    }
}

export default UserReposiitory;