import mongoose, { Document, Schema } from "mongoose";

export interface IProjectMember extends Document {
    userId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
}

const projectMemberSchema: Schema<IProjectMember> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        }
    },
    { timestamps: true }
);

const ProjectMember = mongoose.model<IProjectMember>("ProjectMember", projectMemberSchema);

export default ProjectMember;
