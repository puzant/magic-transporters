import { Request, Response, NextFunction } from "express"
import AppError from "../utils/appError"
import { StatusCodes as Status } from 'http-status-codes'

const errorMiddleware = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      type: err.type,
      errors: err.errors,
      errorDate: err.timestamp,
      statusCode: err.statusCode
    });
  }

  console.error('🔥 ERROR:', err)

  res.status(Status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong',
    type: 'Internatl Error',
  })
}

export default errorMiddleware