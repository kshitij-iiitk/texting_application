import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./socket/socket.js";



import connectToMongoDB from "./db/connectToMongoDB.js";



dotenv.config();

const port = process.env.PORT || 3000;

const __dirname = path.resolve();





app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);





app.use(express.static(path.join(__dirname, "frontend", "dist")));

// IDK whats the problem with this line but its giving pathToRegexpError which i cant resolve 

app.get(/.*/, (req, res) => {
res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});



server.listen(port, () => {
  connectToMongoDB();
  console.log(`Server running at http://localhost:${port}`);
});
