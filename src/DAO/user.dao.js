import { UserModel } from "../models/user.model.js";
import { UserDTO } from "../DTO/user.dto.js";

export default class User {
    updateUserRole = async (email, role) => {
        try {
            return await UserModel.findOneAndUpdate({ email }, { role });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updateUserPassword = async (email, password) => {
        try {
            return await UserModel.findOneAndUpdate({ email }, { password });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findUserById = async (userId) => {
        try {
            const user = await UserModel.findById(userId);
            return user ? new UserDTO(user) : null;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
}