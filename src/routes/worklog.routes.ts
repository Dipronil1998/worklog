import express from "express";
import { worklog, getAllWorklogs, getAllWorklogsProjectWise } from "../controllers/worklog.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/", protectRoute, worklog);

router.get("/", protectRoute, getAllWorklogs);

router.get("/:projectId", protectRoute, getAllWorklogsProjectWise);


export default router;