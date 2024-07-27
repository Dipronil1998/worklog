import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';
import { ObjectId, Types } from 'mongoose';
import User from '../models/user.model';
import generateTokenAndSetCookie from '../utils/generateToken';
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";
import logger from "../services/logger";


interface LogoutRequest extends Request {
    user?: {
        _id: Types.ObjectId;
    };
}

interface ChangePasswordRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        isFirstTimeUser: boolean
    }
}

export const employeeCreate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { fullName, email, phone, password = '123456', role } = req.body;

        if (!fullName || !email || !phone) {
            handleErrorMessage(res, 400, "All fields are required");
            return;
        }

        const user = await User.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });

        if (user) {
            logger.error("Employee already exists")
            handleErrorMessage(res, 400, "Employee already exists");
            return;
        }

        const saltRounds = parseInt(process.env.SALT as string, 10);
        const salt: string = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role,
        });

        if (newUser) {
            await newUser.save();
            logger.info('Employee create successfully.');
            handleSuccessMessage(res, 201, 'Employee create successfully.', {});
        } else {
            logger.error("Invalid user data")
            handleErrorMessage(res, 400, "Invalid user data");
        }
    } catch (error: any) {
        logger.error(error.message)
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, phone, password } = req.body;

        const user = await User.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });
        const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordCorrect) {
            logger.error("Invalid username or password")
            handleErrorMessage(res, 400, "Invalid username or password")
            return;
        }

        generateTokenAndSetCookie(user._id as string, res);
        logger.info('Login successfully.');
        handleSuccessMessage(res, 200, 'Login successfully.', {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isFirstTimeUser: user.isFirstTimeUser
        });
    } catch (error: any) {
        logger.error(error.message)
        next(error)
    }
}

export const logout = async (req: LogoutRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req?.user?._id;
        res.cookie("jwt", "", { maxAge: 0 });
        await User.updateOne({ _id: userId }, { lastSeen: new Date() })
        logger.info("Logged out successfully")
        handleSuccessMessage(res, 200, "Logged out successfully", {})
    } catch (error: any) {
        logger.error(error.message)
        next(error)
    }
}

export const changePassword = async (req: ChangePasswordRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req?.user;
        const { password, confirmPassword } = req?.body;

        if (!user) {
            handleErrorMessage(res, 401, "Unauthorized access");
            return;
        }

        if (!user?.isFirstTimeUser) {
            logger.error("You already change your password.")
            handleErrorMessage(res, 400, "You already change your password.")
            return;
        }

        if (!password || !confirmPassword) {
            logger.error("Password and confirm password fields are required");
            handleErrorMessage(res, 400, "Password and confirm password fields are required");
            return;
        }

        if (password !== confirmPassword) {
            logger.error("Passwords don't match")
            handleErrorMessage(res, 400, "Passwords don't match")
            return;
        }

        const saltRounds = parseInt(process.env.SALT as string, 10);
        const salt: string = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateUser = await User.updateOne(
            { _id: user._id },
            { password: hashedPassword, isFirstTimeUser: false }
        );

        if (updateUser.acknowledged) {
            generateTokenAndSetCookie(user._id as any, res);
            logger.info("Password Changed Successfully")
            handleSuccessMessage(res, 200, "Password Changed Successfully", {})
        } else {
            logger.error("Invalid user data")
            handleErrorMessage(res, 400, "Invalid user data");
        }
    } catch (error) {
        next(error)
    }
}


export const employeeInfo = async (req: ChangePasswordRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find().select('fullName');
        handleSuccessMessage(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        next(error)
    }
}