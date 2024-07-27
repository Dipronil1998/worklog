import jwt from "jsonwebtoken";
import { Response } from "express";

const generateTokenAndSetCookie = (userId: string, res: Response): void => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES as string,
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        sameSite: "strict", 
        secure: process.env.NODE_ENV !== "development",
    });
};

export default generateTokenAndSetCookie;
