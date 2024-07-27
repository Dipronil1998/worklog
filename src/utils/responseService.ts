import { Response } from 'express';

export const handleSuccessMessage = (res:Response, code:number, msg:string, response:any, additional: Record<string, any>  = {}):Response => {
    const success = {
      message: msg,
      status: true,
      statusCode: code,
      response,
      ...additional,
    };
    return res.status(code).json(success);
  };
  
  export const handleErrorMessage = (res:Response, code:number, msg:string, additional: Record<string, any>  = {}):Response => {
    const error = {
      message: msg || 'Something went wrong. Please try again later.',
      status: false,
      statusCode: code || 500,
      response: 'failed',
      ...additional,
    };
    return res.status(code || 500).json(error);
  };