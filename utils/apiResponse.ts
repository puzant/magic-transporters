class ApiResponse {
  static successResponse(message: string, data: any = null) {
    return { 
      message,
      data,
      success: true,
    }
  }
}

export default ApiResponse