import express from "express";
import {
  getProfile,
  login,
  logout,
  userSignup,
} from "../controler/userControler.js";
import { verifyUser } from "../middleware/verifyUser.js";

const userRouter = express.Router();

//userRouter.use("/", (req, res) => res.send("user router is working"));

userRouter.post("/signup", userSignup);

userRouter.post("/login", login);

userRouter.get("/logout", verifyUser, logout);

userRouter.get("/profile", verifyUser, getProfile);

export default userRouter;
