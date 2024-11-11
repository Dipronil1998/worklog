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
exports.deleteProject = exports.getProject = exports.createdProject = void 0;
const project_model_1 = __importDefault(require("../models/project.model"));
const projectmember_model_1 = __importDefault(require("../models/projectmember.model"));
const responseService_1 = require("../utils/responseService");
const logger_1 = __importDefault(require("../services/logger"));
const slugify_1 = require("../utils/slugify");
const mongoose_1 = require("mongoose");
const createdProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { _id, name, description, client, userIds = [], reporter = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id } = req.body;
        const slug = (0, slugify_1.slugify)(name);
        if (!Array.isArray(userIds) || userIds.some(id => !mongoose_1.Types.ObjectId.isValid(id))) {
            (0, responseService_1.handleErrorMessage)(res, 400, 'Invalid user IDs provided.');
            return;
        }
        if (_id) {
            const existingProject = yield project_model_1.default.findById(_id);
            if (!existingProject) {
                (0, responseService_1.handleErrorMessage)(res, 404, 'Project not found.');
                return;
            }
            const slugConflict = yield project_model_1.default.findOne({ slug, _id: { $ne: _id } });
            if (slugConflict) {
                (0, responseService_1.handleErrorMessage)(res, 400, 'A project with this slug already exists.');
                return;
            }
            existingProject.name = name;
            existingProject.slug = slug;
            existingProject.description = description;
            existingProject.reporter = reporter;
            existingProject.client = client;
            existingProject.isInhouse = client ? false : true;
            yield existingProject.save();
            if (userIds.length > 0) {
                yield projectmember_model_1.default.deleteMany({ project: _id, user: { $nin: userIds } });
                for (const userId of userIds) {
                    yield projectmember_model_1.default.findOneAndUpdate({ projectId: _id, userId: userId }, { projectId: _id, userId: userId }, { upsert: true, new: true });
                }
            }
            (0, responseService_1.handleSuccessMessage)(res, 200, 'Project updated successfully', existingProject);
        }
        else {
            const existingProject = yield project_model_1.default.findOne({ slug });
            if (existingProject) {
                (0, responseService_1.handleErrorMessage)(res, 400, 'A project with this name already exists.');
                return;
            }
            const newProject = new project_model_1.default({
                name,
                slug,
                description,
                reporter,
                client,
                isInhouse: client ? false : true
            });
            yield newProject.save();
            if (userIds.length > 0) {
                yield Promise.all(userIds.map(userId => projectmember_model_1.default.create({ projectId: newProject._id, userId: userId })));
            }
            (0, responseService_1.handleSuccessMessage)(res, 201, 'Project created successfully', newProject);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createdProject = createdProject;
const getProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let projects;
        if ((user === null || user === void 0 ? void 0 : user.role) === 'team_lead' || (user === null || user === void 0 ? void 0 : user.role) === 'manager') {
            projects = yield project_model_1.default.find().populate('reporter', 'fullName email');
            const projectsWithMembers = yield Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
                const projectMembers = yield projectmember_model_1.default.find({ projectId: project._id }).populate('userId', 'fullName').exec();
                return Object.assign(Object.assign({}, project.toObject()), { projectMembers: projectMembers.map(pm => ({
                        _id: pm._id,
                        userId: pm.userId,
                        projectId: pm.projectId,
                        __v: pm.__v
                    })) });
            })));
            (0, responseService_1.handleSuccessMessage)(res, 200, 'Projects retrieved successfully', projectsWithMembers);
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === 'employee') {
            const projectMembers = yield projectmember_model_1.default.find({ userId: user._id }).select('projectId');
            const projectIds = projectMembers.map(pm => pm === null || pm === void 0 ? void 0 : pm.projectId);
            if (projectIds.length > 0) {
                projects = yield project_model_1.default.find({ _id: { $in: projectIds } }).populate('reporter', 'fullName email');
                (0, responseService_1.handleSuccessMessage)(res, 200, 'Associated projects retrieved successfully', projects);
            }
            else {
                (0, responseService_1.handleSuccessMessage)(res, 200, 'No associated projects found', []);
            }
        }
        else {
            (0, responseService_1.handleErrorMessage)(res, 403, 'Access denied');
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getProject = getProject;
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const project = yield project_model_1.default.findById(projectId);
        if (!project) {
            (0, responseService_1.handleErrorMessage)(res, 404, 'Project not found');
            return;
        }
        yield projectmember_model_1.default.deleteMany({ projectId });
        yield project_model_1.default.findByIdAndDelete(projectId);
        logger_1.default.info('Project and associated members deleted successfully');
        (0, responseService_1.handleSuccessMessage)(res, 200, 'Project and associated members deleted successfully', project);
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.deleteProject = deleteProject;
