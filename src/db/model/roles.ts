import mongoose, { model } from "mongoose";
import roleInterface from "../../utils/interface/store/role";
import { nanoid } from "nanoid";
import Roles from "../../utils/enum/roles";

const schema = mongoose.Schema;
const roleSchema = new schema<roleInterface>({
    _id: {
        type: String,
        required: false,
        default: () => nanoid(),
    },
    name: {
        type: String,
        required: true,
        enum: Roles
    },
});

export const RoleModel = model("roles", roleSchema);

