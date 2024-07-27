import express from "express";
import { worklog, getAllWorklogs } from "../controllers/worklog.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/", protectRoute, worklog);

router.get("/", protectRoute, getAllWorklogs);


export default router;