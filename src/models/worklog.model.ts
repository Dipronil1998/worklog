import mongoose, { Document, Schema, Model } from "mongoose";

export interface IWorklog extends Document {
    projectId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId; 
    startTime: Date;
    endTime: Date;
    remarks: string;
}

const worklogSchema: Schema<IWorklog> = new Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true, 
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
        },
        remarks: {
            type: String,
        },
    },
    { timestamps: true }
);

const Worklog: Model<IWorklog> = mongoose.model<IWorklog>("Worklog", worklogSchema);

export default Worklog;
