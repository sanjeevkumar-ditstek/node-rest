import mongoose, { model } from "mongoose";
import userInterface from "../../utils/interface/store/user";
import { nanoid } from "nanoid";
import Roles from "../../utils/enum/roles";
const schema = mongoose.Schema;
const userSchema = new schema<userInterface>({
    _id: {
        type: String,
        required: false,
        default: () => nanoid(),
    },
    firstname: {
        type: String,
        required: true,
        default: null
    },
    lastname: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        default: null
    },
    role: {
        type: String,
        enum: Roles,
    },
    image: {
        type: String,
        default: null
    }
});

export const UserModel = model("users", userSchema);
