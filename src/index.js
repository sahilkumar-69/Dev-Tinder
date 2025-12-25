import "dotenv/config";
import express from "express";

import ConnectDB from "./database/connect.db.js";
import cookie from "cookie-parser";
import { userRoutes } from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookie());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/", (err, req, res, next) =>
  res.status(500).json({ error: err.message })
);

const PORT = process.env.PORT || 5000;
ConnectDB()
  .then(() => {
    app.listen(PORT, (error) => {
      if (error) return console.error(error);
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => console.log(error));
