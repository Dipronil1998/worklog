import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITask extends Document {
    name: string;
    description: string;
    status: "pending" | "in_progress" | "done" | "hold";
    assignedTo: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    creationDate: Date;
    endDate?: Date;
    deliveryDate: Date;
    priority: "low" | "medium" | "high";
}

const taskSchema: Schema<ITask> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "done", "hold"],
            default: "pending",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        deliveryDate: {
            type: Date,
            required: false,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
    },
    { timestamps: true }
);

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default Task;