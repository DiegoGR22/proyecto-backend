import { UserModel } from "../models/user.model.js";

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
            return await UserModel.findById(userId);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
}