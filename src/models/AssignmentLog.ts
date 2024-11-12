import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAssignmentLog extends Document {
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    assignedAt: Date;
    comment: string; 
}

const assignmentLogSchema: Schema<IAssignmentLog> = new Schema(
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
        assignedAt: {
            type: Date,
            default: Date.now,
        },
        comment: {
            type: String,
            required: false, 
            default: "",
        },
    },
    { timestamps: true }
);

const AssignmentLog: Model<IAssignmentLog> = mongoose.model<IAssignmentLog>("AssignmentLog", assignmentLogSchema);

export default AssignmentLog;
