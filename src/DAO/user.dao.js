import { UserModel } from "../models/user.model.js";

export const updateUserRole = async (email, role) => {
    return await UserModel.findOneAndUpdate({email}, {role});
}

export const updateUserPassword = async (email, password) => {
    return await UserModel.findOneAndUpdate({email}, {password});
}

export const findUserByIdDAO = async (userId) => {
    return await UserModel.findById(userId);
}