import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../async-wrapper";
import User from "../models/User";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import { BadRequestError } from "../errors";
import cyrpto from "crypto";

declare global {
  namespace express {
    interface Request {
      userId: string;
    }
  }
}

export const signUp = asyncWrapper(async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password, uuid } = req.body;
  let { avatar } = req.body;
  console.log(req.body);
  const existingUser = await User.findOne({ email, username });
  if (existingUser) {
    res.status(400).json({ errors: "User already exists" });
    return;
  }
  //upload the profile picture to cloudinary
  if (avatar) {
    const result = await cloudinary.uploader.upload(avatar);
    avatar = result.url;
  }
  const user = new User({
    firstName,
    lastName,
    email,
    username,
    password,
    avatar,
    uuid,
  });
  await user.save();
  const token = user.generateToken();
  res.cookie("token", token, {
    sameSite: "none",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL as string
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).json({ user, token });
});

export const logout = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly:true,
      secure: process.env.NODE_ENV === "production" 
      sameSite: "none",
    });
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).json({ message: "User Signed Out Successfully" });
  }
);

export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid Credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid Credentials");
    }
    const token = user.generateToken();
    res.cookie("token", token, {
      sameSite: "none",
      httpOnly: true,
      secure: process.env.NODE_ENV ==="production"
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).json({ user, token });
  }
);

export const LoginByGoogle = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log(user, "user");
    if (user) {
      const token = user.generateToken();
      res.cookie("token", token, {
        sameSite: "none",
        httpOnly: true,
        secure: process.env.NODE_ENV ==="production",
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.status(200).json({ user, token });
    } else {
      const { firstName, lastName, email, username, uuid, avatar } = req.body;
      const password = cyrpto.randomBytes(20).toString("hex");
      const user = new User({
        firstName,
        lastName,
        email,
        username,
        password,
        avatar,
        uuid,
      });
      await user.save();
      const token = user.generateToken();
      res.cookie("token", token, {
        sameSite: "none",

        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.FRONTEND_URL as string
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.status(200).json({ user, token });
    }
  }
);

export const getProfileById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).json(user);
  }
);

export const getMyProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    console.log(user);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL as string
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).json(user);
  }
);
