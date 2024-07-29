import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    isFirstTimeUser: Boolean,
    role: "manager" | "team_lead" | "employee";
}

const userSchema: Schema<IUser> = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        isFirstTimeUser: {
            type:Boolean,
            default: true
        },
        role: {
            type: String,
            required: true,
            // default:'employee',
            enum: ["manager", "team_lead","employee"],
        },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
