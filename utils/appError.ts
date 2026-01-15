import { StatusCodes } from 'http-status-codes'

class AppError extends Error {
  public statusCode: number
  public timestamp: Date
  public type: string
  public errors?: any
  
  constructor(message: string, statusCode: number, errors?: any) {
    super(message)
    this.statusCode = statusCode
    this.timestamp = new Date()
    this.type = this.getErrorType(statusCode)
    this.errors = errors

    Error.captureStackTrace(this, this.constructor)
  }

  getErrorType(statusCode: number): string {
    const statusTypeMap: Record<number, string> = {
      [StatusCodes.BAD_REQUEST]: 'Validation Error',
      [StatusCodes.UNAUTHORIZED]: 'Unauthorized Error',
      [StatusCodes.FORBIDDEN]: 'Forbidden Error',
      [StatusCodes.NOT_FOUND]: 'Not Found Error',
      [StatusCodes.INTERNAL_SERVER_ERROR]: 'Internal Error'
    }

    return statusTypeMap[statusCode] || 'General Error'
  }
}

export default AppError