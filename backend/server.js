import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"; 
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);


server.listen(port, () => {
  connectToMongoDB(); 
  console.log(`Server running at http://localhost:${port}`);
});
