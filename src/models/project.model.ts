import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProject extends Document {
    name: string
    slug: string
    description: string;
    client: string;
    reporter: mongoose.Types.ObjectId;
    isInhouse: boolean;
}

const projectSchema: Schema<IProject> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        client:{
            type: String,
        },
        isInhouse:{
            type: Boolean
        },
        reporter:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

const Project: Model<IProject> = mongoose.model<IProject>("Project", projectSchema);

export default Project;
