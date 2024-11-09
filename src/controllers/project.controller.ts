import { Request, Response, NextFunction } from "express";
import Project, { IProject } from '../models/project.model';
import ProjectMember, { IProjectMember } from '../models/projectmember.model';
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";
import logger from "../services/logger";
import { slugify } from "../utils/slugify";
import { Types } from "mongoose";

interface ProjectCreateRequest extends Request{
    user?: {
        _id: string;
    };
}

interface CustomRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        role: string;
    };
}

export const createdProject = async (req: ProjectCreateRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { _id, name, description,client, userIds = [],reporter = req.user?._id } = req.body;
        const slug = slugify(name);

        if (!Array.isArray(userIds) || userIds.some(id => !Types.ObjectId.isValid(id))) {
            handleErrorMessage(res, 400, 'Invalid user IDs provided.');
            return;
        }

        if (_id) {
            const existingProject = await Project.findById(_id);
            if (!existingProject) {
                handleErrorMessage(res, 404, 'Project not found.');
                return;
            }

            const slugConflict = await Project.findOne({ slug, _id: { $ne: _id } });
            if (slugConflict) {
                handleErrorMessage(res, 400, 'A project with this slug already exists.');
                return;
            }

            existingProject.name = name;
            existingProject.slug = slug;
            existingProject.description = description;
            existingProject.reporter = reporter;
            existingProject.client = client;
            existingProject.isInhouse = client ? false : true;

            await existingProject.save();
            if (userIds.length > 0) {
                await ProjectMember.deleteMany({ project: _id, user: { $nin: userIds } });

                for (const userId of userIds) {
                    await ProjectMember.findOneAndUpdate(
                        { projectId: _id, userId: userId },
                        { projectId: _id, userId: userId },
                        { upsert: true, new: true }
                    );
                }
            }
            handleSuccessMessage(res, 200, 'Project updated successfully', existingProject);
        } else {
            const existingProject = await Project.findOne({ slug });
            if (existingProject) {
                handleErrorMessage(res, 400, 'A project with this name already exists.');
                return;
            }

            const newProject = new Project({
                name,
                slug,
                description,
                reporter,
                client,
                isInhouse: client ? false : true
            });

            await newProject.save();

            if (userIds.length > 0) {
                await Promise.all(userIds.map(userId =>
                    ProjectMember.create({ projectId: newProject._id, userId: userId })
                ));
            }
            handleSuccessMessage(res, 201, 'Project created successfully', newProject);
        }
    } catch (error: any) {
        next(error);
    }
};


export const getProject = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;
        let projects;

        if (user?.role === 'team_lead' || user?.role === 'manager') {
            projects = await Project.find().populate('reporter', 'fullName email');

            const projectsWithMembers = await Promise.all(projects.map(async (project) => {
                const projectMembers = await ProjectMember.find({ projectId: project._id }).populate('userId', 'fullName').exec() as IProjectMember[];
                return {
                    ...project.toObject(),
                    projectMembers: projectMembers.map(pm => ({
                        _id: pm._id,
                        userId: pm.userId,
                        projectId: pm.projectId,
                        __v: pm.__v
                    }))
                };
            }));
            handleSuccessMessage(res, 200, 'Projects retrieved successfully', projectsWithMembers);
        } else if (user?.role === 'employee') {
            const projectMembers = await ProjectMember.find({ userId: user._id }).select('projectId');
            
            const projectIds = projectMembers.map(pm => pm?.projectId);
            
            if (projectIds.length > 0) {
                projects = await Project.find({ _id: { $in: projectIds } }).populate('reporter', 'fullName email');
                handleSuccessMessage(res, 200, 'Associated projects retrieved successfully', projects);
            } else {
                handleSuccessMessage(res, 200, 'No associated projects found', []);
            }
        } else {
            handleErrorMessage(res, 403, 'Access denied');
        }

        
    } catch (error) {
        next(error);
    }
}