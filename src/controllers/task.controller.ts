import { Request, Response, NextFunction } from "express";
import Task from "../models/task.model";
import logger from "../services/logger";
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";
import { log } from "console";
import mongoose, { Types } from "mongoose";
import AssignmentLog from "../models/AssignmentLog";

interface TaskRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        fullName: string;
        profilePic: string;
    };
}

export const createTask = async (req: TaskRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { _id, name, description, projectId, assignedTo, creationDate, endDate, deliveryDate, comment } = req.body;
    

        if(_id){
            const existingTask = await Task.findById(_id);
            if (!existingTask) {
                handleErrorMessage(res, 404, 'Task not found.');
                return;
            }

            existingTask.name = name || existingTask.name;
            existingTask.description = description || existingTask.description;
            existingTask.projectId = projectId || existingTask.projectId;
            existingTask.assignedTo = assignedTo || existingTask.assignedTo;
            existingTask.creationDate = creationDate || existingTask.creationDate;
            existingTask.endDate = endDate || existingTask.endDate;
            existingTask.deliveryDate = deliveryDate || existingTask.deliveryDate;
            // existingTask.files = filePaths || existingTask.files;

            await existingTask.save();

            const assignmentLog = new AssignmentLog({
                taskId: existingTask._id,
                userId: assignedTo || existingTask.assignedTo, 
                assignedAt: new Date(), 
                comment, 
            });
    
            await assignmentLog.save();

            logger.info("Task updated successfully");
            handleSuccessMessage(res, 200, "Task updated successfully", existingTask);
        } else {
            const files = req.files as Express.Multer.File[];

            const filePaths = files?.map(file => `/uploads/tasks/${file.filename}`); 

            const newTask = new Task({
                name,
                description,
                projectId,
                assignedTo,
                creationDate,
                endDate,
                deliveryDate,
                status: "pending",
                files: filePaths,
                createdBy: req.user?._id
            });
    
            await newTask.save();
    
            const assignmentLog = new AssignmentLog({
                taskId: newTask._id,
                userId: assignedTo, 
                assignedAt: new Date(), 
                comment, 
            });
    
            await assignmentLog.save();
    
            logger.info("Task created successfully");
            handleSuccessMessage(res, 201, "Task created successfully", newTask);
        }
    } catch (error: any) {
        logger.error(error.message);
        next(error);
    }
};

export const getTasks = async (req: TaskRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id;
        let returnTasks : any= [];

        const assignmentLogs = await AssignmentLog.find({ userId: userId }).populate({
            path: "taskId",
            select: "_id"
        });
        
        const taskIds = assignmentLogs.map(log => log.taskId._id);

        const tasks = await Task.find({ $or: [
            { _id: { $in: taskIds } }, 
            { createdBy: userId } 
        ] })
            .populate({
                path: "projectId",
                select: "name"
            })
            .populate({
                path: "assignedTo",
                select: "fullName email"
            })
            .populate({
                path: "createdBy",
                select: "fullName"
            });

            for (const task of tasks) {
                const assignmentLogsForTask = await AssignmentLog.find({ taskId: task._id },{userId:1,comment:1}).populate({
                    path: "userId",
                    select: "fullName"
                });
                
                returnTasks.push({
                    ...task.toObject(),
                    comments: assignmentLogsForTask   
                });
            }
            
        logger.info("Tasks retrieved successfully");
        handleSuccessMessage(res, 200, "Tasks retrieved successfully", returnTasks);
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
