import express from "express";

import { sendMessage, getMessage } from "../controllers/message.controllers.js";
import protectedroute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/send/:id",protectedroute, sendMessage);
router.get("/:id",protectedroute, getMessage);

export default router;
