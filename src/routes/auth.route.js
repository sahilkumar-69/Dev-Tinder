import { Router } from "express";
import { login, logout, signup, editProfile} from "../controllers/auth.controller.js";
import Authenticate from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.get("/logout", logout);
authRoutes.get("/profile/view", Authenticate, (req, res) =>
  res.status(200).json({ success: true, data: req.user })
);

authRoutes.patch("/profile/edit", Authenticate, editProfile);

export default authRoutes;
