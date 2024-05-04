import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Request, Response } from "express";
import errorMiddleWare from "./middleware/error-middleware";
import { v2 as cloudinary } from "cloudinary";
import userRouter from "./routes/users";

const PORT = process.env.PORT || 7000;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
app.use("/api/v1/users", userRouter);

app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`app is listening to port ${PORT}`);
});
