import mongoose from "mongoose";

const userHasRoleSchema = new mongoose.Schema({
    USER_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ROLE_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
});

export const UserHasRole = mongoose.models?.UserHasRole || mongoose.model("UserHasRole", userHasRoleSchema);