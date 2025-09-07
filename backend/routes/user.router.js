import express from "express";
import { AskToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import uploader from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";
  

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser)
userRouter.post("/update", isAuth, uploader.single("assistantImage"), updateAssistant)
userRouter.post("/asktoassistant", isAuth, AskToAssistant)

export default userRouter; 