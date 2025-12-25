import { Router } from "express";
import {
  userRequestsReceived,
  userConnections,
  sendConnectionRequest,
  reviewConnectionRequest
} from "../controllers/user.controller.js";
import Authenticate from "../middlewares/AuthMiddleware.js";

export const userRoutes = Router();

userRoutes.get("/connections", Authenticate, userConnections);
userRoutes.get("/requests/received", Authenticate, userRequestsReceived);
userRoutes.get("/feed", Authenticate);

userRoutes.post("/request/send/:status/:userId", Authenticate,sendConnectionRequest);
userRoutes.post("/request/review/:status/:requestId", Authenticate,reviewConnectionRequest);
