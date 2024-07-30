import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose';
import Worklog from '../models/worklog.model'; 
import logger from "../services/logger";
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";
import { formatDuration } from "../utils/formatDuration";

interface WorklogRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        fullName: string;
        profilePic:string;
    };
}

interface GetWorklogRequest extends Request {
    query: {
        startDate?: string;
        endDate?: string;
        userId?: string;
    };
}


export const worklog = async (req:WorklogRequest,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const userId = req?.user?._id
        const { projectId, remarks } = req.body;
        
        let worklogEntry = await Worklog.findOne({ userId, projectId, endTime: null });

        if (worklogEntry) {
            worklogEntry.endTime = new Date();
            worklogEntry.remarks = remarks;
            await worklogEntry.save();
            logger.info('Worklog updated successfully');
            handleSuccessMessage(res, 200, 'Worklog updated successfully', worklogEntry);
        } else {
            const newWorklog = new Worklog({
                userId,
                projectId,
                startTime: new Date(),
                endTime:null,
                remarks
            });

            await newWorklog.save();
            logger.info('Worklog created successfully');
            handleSuccessMessage(res, 201, 'Worklog created successfully', newWorklog);
        }

    } catch (error:any) {
        logger.error(error.message)
        next(error)
    }
}



export const getAllWorklogs = async (req:GetWorklogRequest,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const { startDate, endDate,userId } = req.query;

        const now = new Date();
        const start = startDate ? new Date(startDate as string) : new Date(now.setHours(0, 0, 0, 0));
        const end = endDate ? new Date(endDate as string) : new Date(now.setHours(23, 59, 59, 999));

        const query: any = {
            startTime: { $gte: start, $lte: end }
        };

        if (userId) {
            if (!Types.ObjectId.isValid(userId)) {
                logger.error("Invalid userId format.");
                handleErrorMessage(res, 400, "Invalid userId format.");
                return;
            }

            query.userId = userId;
        }

        const worklogs = await Worklog.find(query)
        .populate({
            path: 'userId', 
            select: 'fullName email role'
        })
        .populate({
            path: 'projectId', 
            select: 'name reporter',
            populate: {
                path: 'reporter',
                select: 'fullName'
            }
        });
        logger.info('Worklogs retrieved successfully');
        handleSuccessMessage(res, 200, 'Worklogs retrieved successfully', worklogs);
    } catch (error: any) {
        logger.error(error.message);
        next(error);
    }
}

export const getAllWorklogsProjectWise = async (req:WorklogRequest,res:Response,next:NextFunction):Promise<void> =>{
    try {
        let duration=0;
        const projectId = req?.params?.projectId;
        const userId = req?.user?._id;

        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0));
        const end = new Date(now.setHours(23, 59, 59, 999));

        const query:any = {
            projectId,userId,startTime: { $gte: start, $lte: end }
        }

        const worklogs = await Worklog.find(query).sort({createdAt: -1})
        worklogs.map(worklog => {
            const sTime = new Date(worklog.startTime);
            const eTime = worklog.endTime ? new Date(worklog.endTime) : new Date();
            duration = duration + Math.abs(eTime.getTime() - sTime.getTime());
        });
        
        logger.info('Worklogs retrieved successfully by projectwise.');
        handleSuccessMessage(res, 200, 'Worklogs retrieved successfully by projectwise.', worklogs,{
            additional:{
                duration: formatDuration(duration)
            }
        });
    } catch (error:any) {
        logger.error(error.message);
        next(error);
    }
}