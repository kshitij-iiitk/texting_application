import express from "express";
import protectedroute from "../middleware/protectRoute.js";
import { getUsersForSidebar } from "../controllers/user.controllers.js";

const router = express.Router();


router.get("/", protectedroute, getUsersForSidebar);

export default router;
