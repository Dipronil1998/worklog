import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITaskComment extends Document {
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    comment: string;
}

const taskCommentSchema: Schema<ITaskComment> = new Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        }
    },
    { timestamps: true }
);

const TaskComment: Model<ITaskComment> = mongoose.model<ITaskComment>("TaskComment", taskCommentSchema);

export default TaskComment;
