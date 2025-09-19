import { Response } from "express";
// Helper function for standardized error responses
export const sendErrorResponse = (res: Response, statusCode: number, errorMessage: string): void => {
    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  };