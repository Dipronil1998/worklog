"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskStatus = exports.getTasks = exports.createTask = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const logger_1 = __importDefault(require("../services/logger"));
const responseService_1 = require("../utils/responseService");
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, projectId, assignedTo, creationDate, endDate, deliveryDate } = req.body;
        const files = req.files;
        const filePaths = files === null || files === void 0 ? void 0 : files.map(file => `/tasks/${file.filename}`);
        const newTask = new task_model_1.default({
            name,
            description,
            projectId,
            assignedTo,
            creationDate,
            endDate,
            deliveryDate,
            status: "pending",
            files: filePaths,
        });
        yield newTask.save();
        logger_1.default.info("Task created successfully");
        (0, responseService_1.handleSuccessMessage)(res, 201, "Task created successfully", newTask);
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.createTask = createTask;
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_model_1.default.find()
            .populate({
            path: "projectId",
            select: "name"
        })
            .populate({
            path: "assignedTo",
            select: "fullName email"
        });
        logger_1.default.info("Tasks retrieved successfully");
        (0, responseService_1.handleSuccessMessage)(res, 200, "Tasks retrieved successfully", tasks);
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.getTasks = getTasks;
const updateTaskStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        if (!["in-progress", "pending", "done", "hold"].includes(status)) {
            (0, responseService_1.handleErrorMessage)(res, 400, "Invalid status value");
            return;
        }
        const task = yield task_model_1.default.findById(taskId);
        if (!task) {
            (0, responseService_1.handleErrorMessage)(res, 404, "Task not found");
            return;
        }
        task.status = status;
        yield task.save();
        logger_1.default.info("Task status updated successfully");
        (0, responseService_1.handleSuccessMessage)(res, 200, "Task status updated successfully", task);
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const task = yield task_model_1.default.findByIdAndDelete(taskId);
        if (!task) {
            (0, responseService_1.handleErrorMessage)(res, 404, "Task not found");
            return;
        }
        logger_1.default.info("Task deleted successfully");
        (0, responseService_1.handleSuccessMessage)(res, 200, "Task deleted successfully", task);
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.deleteTask = deleteTask;
