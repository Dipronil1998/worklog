import mongoose, { Document, Schema, Model } from "mongoose";

export interface IWorklog extends Document {
    projectId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    startTime: Date,
    endTime: Date,
    remarks: string
}

const worklogSchema: Schema<IWorklog> = new Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        startTime:{
            type: Date,
        },
        endTime:{
            type: Date,
        },
        remarks:{
            type: String,
        },

    },
    { timestamps: true }
);

const Worklog: Model<IWorklog> = mongoose.model<IWorklog>("Worklog", worklogSchema);

export default Worklog;
