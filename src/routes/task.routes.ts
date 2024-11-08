import express from "express";
import { createTask, getTasks, updateTaskStatus } from "../controllers/task.controller";
import protectRoute from "../middleware/protectRoute";
import { adminPermission } from "../middleware/adminPermission";

const router = express.Router();

router.post("/", protectRoute, adminPermission, createTask);

router.get("/", protectRoute, getTasks);

router.patch("/:taskId/status", protectRoute, updateTaskStatus);

export default router;
