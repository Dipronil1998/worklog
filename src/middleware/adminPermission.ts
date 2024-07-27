import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { handleErrorMessage } from "../utils/responseService";

interface adminPermissionRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        role: string
    }
}

export const adminPermission = async (req: adminPermissionRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = req?.user;
    if(user?.role === 'manager' || user?.role === 'team_lead'){
        next();
    } else {
        handleErrorMessage(res, 403, "You donot have permission.")
    }
}