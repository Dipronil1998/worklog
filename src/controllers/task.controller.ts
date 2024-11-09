import { Request, Response, NextFunction } from "express";
import Task from "../models/task.model";
import logger from "../services/logger";
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";
import { log } from "console";
import { Types } from "mongoose";

interface TaskRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        fullName: string;
        profilePic: string;
    };
}

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description, projectId, assignedTo, creationDate, endDate, deliveryDate } = req.body;
        
        const newTask = new Task({
            name,
            description,
            projectId,
            assignedTo,
            creationDate,
            endDate,
            deliveryDate,
            status: "pending" 
        });

        await newTask.save();
        logger.info("Task created successfully");
        handleSuccessMessage(res, 201, "Task created successfully", newTask);
    } catch (error: any) {
        logger.error(error.message);
        next(error);
    }
};

export const getTasks = async (req: TaskRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tasks = await Task.find()
            .populate({
                path: "projectId",
                select: "name"
            })
            .populate({
                path: "assignedTo",
                select: "fullName email"
            });

        logger.info("Tasks retrieved successfully");
        handleSuccessMessage(res, 200, "Tasks retrieved successfully", tasks);
    } catch (error: any) {
        logger.error(error.message);
        next(error);
    }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        if (!["in-progress", "pending", "done", "hold"].includes(status)) {
            handleErrorMessage(res, 400, "Invalid status value");
            return;
        }

        const task = await Task.findById(taskId);
        if (!task) {
            handleErrorMessage(res, 404, "Task not found");
            return;
        }

        task.status = status;
        await task.save();

        logger.info("Task status updated successfully");
        handleSuccessMessage(res, 200, "Task status updated successfully", task);
    } catch (error: any) {
        logger.error(error.message);
        next(error);
    }
};


export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { taskId } = req.params;

        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            handleErrorMessage(res, 404, "Task not found");
            return;
        }


        logger.info("Task deleted successfully");
        handleSuccessMessage(res, 200, "Task deleted successfully", task);
    } catch (error: any) {
        logger.error(error.message);
        next(error);
    }
};
