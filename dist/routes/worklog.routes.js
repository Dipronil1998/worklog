"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const worklog_controller_1 = require("../controllers/worklog.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = express_1.default.Router();
router.post("/", protectRoute_1.default, worklog_controller_1.worklog);
router.get("/", protectRoute_1.default, worklog_controller_1.getAllWorklogs);
router.get("/:projectId", protectRoute_1.default, worklog_controller_1.getAllWorklogsProjectWise);
exports.default = router;
