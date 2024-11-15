import express from "express";
import { createdProject, getProject, deleteProject, getUserByProject } from "../controllers/project.controller";
import protectRoute from "../middleware/protectRoute";
import { adminPermission } from "../middleware/adminPermission";

const router = express.Router();

router.post("/", protectRoute, adminPermission, createdProject);

router.get("/", protectRoute, getProject);

router.get("/assign/:projectId", protectRoute, getUserByProject);

router.delete("/:projectId", protectRoute, deleteProject);

export default router;