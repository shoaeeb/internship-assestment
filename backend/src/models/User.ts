import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type UserType = {
  _id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  gender: string;
  admin: boolean;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  generateToken: () => string;
};

const userSchema = new mongoose.Schema<UserType>(
  {
    uuid: { type: String, required: [true, "uuid is required"] },
    firstName: { type: String, required: [true, "first name is required"] },
    lastName: { type: String, required: [true, "last name is required"] },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    avatar: { type: String, default: "" },
    password: { type: String, required: [true, "password is required"] },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

const User = mongoose.model<UserType>("User", userSchema);
export default User;
