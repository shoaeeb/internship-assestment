import express from "express";
import {
  LoginByGoogle,
  getMyProfile,
  getProfileById,
  login,
  logout,
  signUp,
} from "../controllers/users";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/signup", signUp);
router.post("/logout", logout);
router.post("/login", login);
router.post("/login/google", LoginByGoogle);
router.get("/profile/:id", getProfileById);
router.get("/me", verifyToken, getMyProfile);

export default router;
