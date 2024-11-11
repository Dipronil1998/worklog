"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const task_controller_1 = require("../controllers/task.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const adminPermission_1 = require("../middleware/adminPermission");
const router = express_1.default.Router();
const uploadDirectory = path_1.default.join(__dirname, "..", "..", "uploads", "tasks");
if (!fs_1.default.existsSync(uploadDirectory)) {
    fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        const error = new Error("Only image files are allowed!");
        cb(error, false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
router.post("/", protectRoute_1.default, adminPermission_1.adminPermission, upload.array("files", 10), task_controller_1.createTask);
router.get("/", protectRoute_1.default, task_controller_1.getTasks);
router.patch("/:taskId/status", protectRoute_1.default, task_controller_1.updateTaskStatus);
router.delete("/:taskId", protectRoute_1.default, adminPermission_1.adminPermission, task_controller_1.deleteTask);
exports.default = router;
