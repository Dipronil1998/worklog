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
exports.getAllWorklogsProjectWise = exports.getAllWorklogs = exports.worklog = void 0;
const mongoose_1 = require("mongoose");
const worklog_model_1 = __importDefault(require("../models/worklog.model"));
const logger_1 = __importDefault(require("../services/logger"));
const responseService_1 = require("../utils/responseService");
const formatDuration_1 = require("../utils/formatDuration");
const worklog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { projectId, remarks } = req.body;
        let worklogEntry = yield worklog_model_1.default.findOne({ userId, projectId, endTime: null });
        if (worklogEntry) {
            worklogEntry.endTime = new Date();
            worklogEntry.remarks = remarks;
            yield worklogEntry.save();
            logger_1.default.info('Worklog updated successfully');
            (0, responseService_1.handleSuccessMessage)(res, 200, 'Worklog updated successfully', worklogEntry);
        }
        else {
            const newWorklog = new worklog_model_1.default({
                userId,
                projectId,
                startTime: new Date(),
                endTime: null,
                remarks
            });
            yield newWorklog.save();
            logger_1.default.info('Worklog created successfully');
            (0, responseService_1.handleSuccessMessage)(res, 201, 'Worklog created successfully', newWorklog);
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.worklog = worklog;
const getAllWorklogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, userId } = req.query;
        const now = new Date();
        const start = startDate ? new Date(startDate) : new Date(now.setHours(0, 0, 0, 0));
        const end = endDate ? new Date(endDate) : new Date(now.setHours(23, 59, 59, 999));
        const query = {
            startTime: { $gte: start, $lte: end }
        };
        if (userId) {
            if (!mongoose_1.Types.ObjectId.isValid(userId)) {
                logger_1.default.error("Invalid userId format.");
                (0, responseService_1.handleErrorMessage)(res, 400, "Invalid userId format.");
                return;
            }
            query.userId = userId;
        }
        const worklogs = yield worklog_model_1.default.find(query)
            .populate({
            path: 'userId',
            select: 'fullName email role'
        })
            .populate({
            path: 'projectId',
            select: 'name reporter',
            populate: {
                path: 'reporter',
                select: 'fullName'
            }
        });
        logger_1.default.info('Worklogs retrieved successfully');
        (0, responseService_1.handleSuccessMessage)(res, 200, 'Worklogs retrieved successfully', worklogs);
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.getAllWorklogs = getAllWorklogs;
const getAllWorklogsProjectWise = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let duration = 0;
        const projectId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.projectId;
        const userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0));
        const end = new Date(now.setHours(23, 59, 59, 999));
        const query = {
            projectId, userId, startTime: { $gte: start, $lte: end }
        };
        const worklogs = yield worklog_model_1.default.find(query).sort({ createdAt: -1 });
        worklogs.map(worklog => {
            const sTime = new Date(worklog.startTime);
            const eTime = worklog.endTime ? new Date(worklog.endTime) : new Date();
            duration = duration + Math.abs(eTime.getTime() - sTime.getTime());
        });
        logger_1.default.info('Worklogs retrieved successfully by projectwise.');
        (0, responseService_1.handleSuccessMessage)(res, 200, 'Worklogs retrieved successfully by projectwise.', worklogs, {
            additional: {
                duration: (0, formatDuration_1.formatDuration)(duration)
            }
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.getAllWorklogsProjectWise = getAllWorklogsProjectWise;
