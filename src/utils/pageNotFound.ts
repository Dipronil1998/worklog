import { Request, Response, NextFunction } from 'express';

// Extend the Error class to include a status property
class HttpError extends Error {
    status?: number;
}

export const pageNotFound = (req: Request, res: Response, next: NextFunction): void => {
    const err = new HttpError("Page not found");
    err.status = 404;
    next(err);
};
