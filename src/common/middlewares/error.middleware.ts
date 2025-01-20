import { Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { NextFunction } from "connect";

function errorMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction) {
  console.log("error", res);

  const status: number = error.status || 500;
  const message: string = error.message || "Something went wrong";

  console.log("[ERROR] ", status, message);

  res.status(status).json({ message });
}

export default errorMiddleware;
