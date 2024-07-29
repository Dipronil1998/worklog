import { Request, Response, NextFunction } from 'express';
import { handleErrorMessage } from './responseService';


class HttpError extends Error {
    status?: number;
}

export const errorHandler = (err:HttpError, req:Request, res:Response, next:NextFunction): Response => {
    res.locals.message = err.message || "Please try again after some time";
    const status = 200
    return handleErrorMessage(res,status,res.locals.message)
  };