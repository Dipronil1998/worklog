import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (userId: string, res: Response): string => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES as string,
    });

    return token;
};


//generateTokenAndSetCookie
export default generateToken;
