import express from "express";
import { createdProject, getProject } from "../controllers/project.controller";
import protectRoute from "../middleware/protectRoute";
import { adminPermission } from "../middleware/adminPermission";

const router = express.Router();

router.post("/", protectRoute, adminPermission, createdProject);

router.get("/", protectRoute, getProject);

export default router;