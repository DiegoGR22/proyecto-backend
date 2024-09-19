import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        // unique: true
    },
    age: {
        type: Number,
        min: 0,
        max: 100
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
    }
});

export const UserModel = model("users", UserSchema);
