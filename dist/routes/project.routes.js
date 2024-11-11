"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controllers/project.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const adminPermission_1 = require("../middleware/adminPermission");
const router = express_1.default.Router();
router.post("/", protectRoute_1.default, adminPermission_1.adminPermission, project_controller_1.createdProject);
router.get("/", protectRoute_1.default, project_controller_1.getProject);
router.delete("/:projectId", protectRoute_1.default, project_controller_1.deleteProject);
exports.default = router;
