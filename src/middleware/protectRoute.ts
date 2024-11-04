import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import { handleErrorMessage } from "../utils/responseService";

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            handleErrorMessage(res, 401, 'Unauthorized - No Token Provided');
            return;
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

        if (!decoded) {
            handleErrorMessage(res, 401, 'Unauthorized - Invalid Token');
            return;
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            handleErrorMessage(res, 404, 'User not found');
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default protectRoute;