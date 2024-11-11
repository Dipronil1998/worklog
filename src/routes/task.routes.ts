import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createTask, getTasks, updateTaskStatus, deleteTask } from "../controllers/task.controller";
import protectRoute from "../middleware/protectRoute";
import { adminPermission } from "../middleware/adminPermission";

const router = express.Router();

const uploadDirectory = path.join(__dirname, "..","..","uploads", "tasks");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);  
    },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);  
    } else {
        const error = new Error("Only image files are allowed!") as multer.MulterError;
        cb(error as any, false);  
    }
};

const upload = multer({ storage, fileFilter });

router.post("/", protectRoute, adminPermission, upload.array("files", 10), createTask);  
router.get("/", protectRoute, getTasks);  
router.patch("/:taskId/status", protectRoute, updateTaskStatus);  
router.delete("/:taskId", protectRoute, adminPermission, deleteTask);  

export default router;
