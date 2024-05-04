import asyncWrapper from "../async-wrapper";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["token"];
    if (!token) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const userId = (decoded as JwtPayload).userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    req.userId = user._id;
    next();
  }
);
