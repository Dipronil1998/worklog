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
exports.employeeInfoById = exports.employeeInfo = exports.changePassword = exports.logout = exports.login = exports.employeeCreate = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const responseService_1 = require("../utils/responseService");
const logger_1 = __importDefault(require("../services/logger"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const employeeCreate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, fullName, email, phone, password, role = 'employee', isFirstTimeUser } = req.body;
        if (!fullName || !email || !phone) {
            (0, responseService_1.handleErrorMessage)(res, 400, "All fields are required");
            return;
        }
        if (_id) {
            const existingUser = yield user_model_1.default.findById(_id);
            if (!existingUser) {
                (0, responseService_1.handleErrorMessage)(res, 404, "Employee not found");
                return;
            }
            const duplicateUser = yield user_model_1.default.findOne({
                $or: [
                    { email: email },
                    { phone: phone }
                ],
                _id: { $ne: _id }
            });
            if (duplicateUser) {
                (0, responseService_1.handleErrorMessage)(res, 400, "Email or phone already in use by another employee");
                return;
            }
            existingUser.fullName = fullName;
            existingUser.email = email;
            existingUser.phone = phone;
            existingUser.role = role;
            existingUser.isFirstTimeUser = isFirstTimeUser !== undefined ? isFirstTimeUser : existingUser.isFirstTimeUser;
            if (password) {
                const saltRounds = parseInt(process.env.SALT, 10);
                const salt = yield bcryptjs_1.default.genSalt(saltRounds);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                existingUser.password = hashedPassword;
                existingUser.isFirstTimeUser = true;
            }
            yield existingUser.save();
            logger_1.default.info('Employee updated successfully.');
            (0, responseService_1.handleSuccessMessage)(res, 200, 'Employee updated successfully.', existingUser);
        }
        else {
            // Check for existing user by email or phone
            const existingUser = yield user_model_1.default.findOne({
                $or: [
                    { email: email },
                    { phone: phone }
                ]
            });
            if (existingUser) {
                (0, responseService_1.handleErrorMessage)(res, 400, "Employee already exists");
                return;
            }
            const saltRounds = parseInt(process.env.SALT, 10);
            const salt = yield bcryptjs_1.default.genSalt(saltRounds);
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            const newUser = new user_model_1.default({
                fullName,
                email,
                phone,
                password: hashedPassword,
                role,
                isFirstTimeUser
            });
            yield newUser.save();
            logger_1.default.info('Employee created successfully.');
            (0, responseService_1.handleSuccessMessage)(res, 201, 'Employee created successfully.', newUser);
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.employeeCreate = employeeCreate;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginIdentifier, password } = req.body;
        if (!loginIdentifier || !password) {
            (0, responseService_1.handleErrorMessage)(res, 400, "Login identifier and password are required");
            return;
        }
        const user = yield user_model_1.default.findOne({
            $or: [
                { email: loginIdentifier },
                { phone: loginIdentifier }
            ]
        });
        const isPasswordCorrect = user ? yield bcryptjs_1.default.compare(password, user.password) : false;
        if (!user || !isPasswordCorrect) {
            logger_1.default.error("Invalid username or password");
            (0, responseService_1.handleErrorMessage)(res, 400, "Invalid username or password");
            return;
        }
        const token = (0, generateToken_1.default)(user._id, res);
        logger_1.default.info('Login successfully.');
        (0, responseService_1.handleSuccessMessage)(res, 200, 'Login successfully.', {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isFirstTimeUser: user.isFirstTimeUser
        }, { token });
    }
    catch (error) {
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info("Logged out successfully");
        (0, responseService_1.handleSuccessMessage)(res, 200, "Logged out successfully", {});
    }
    catch (error) {
        console.log(error);
        logger_1.default.error(error.message);
        next(error);
    }
});
exports.logout = logout;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req === null || req === void 0 ? void 0 : req.user;
        const { password, confirmPassword } = req === null || req === void 0 ? void 0 : req.body;
        if (!user) {
            (0, responseService_1.handleErrorMessage)(res, 401, "Unauthorized access");
            return;
        }
        if (!(user === null || user === void 0 ? void 0 : user.isFirstTimeUser)) {
            logger_1.default.error("You already change your password.");
            (0, responseService_1.handleErrorMessage)(res, 400, "You already change your password.");
            return;
        }
        if (!password || !confirmPassword) {
            logger_1.default.error("Password and confirm password fields are required");
            (0, responseService_1.handleErrorMessage)(res, 400, "Password and confirm password fields are required");
            return;
        }
        if (password !== confirmPassword) {
            logger_1.default.error("Passwords don't match");
            (0, responseService_1.handleErrorMessage)(res, 400, "Passwords don't match");
            return;
        }
        const saltRounds = parseInt(process.env.SALT, 10);
        const salt = yield bcryptjs_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const updateUser = yield user_model_1.default.updateOne({ _id: user._id }, { password: hashedPassword, isFirstTimeUser: false });
        if (updateUser.acknowledged) {
            const token = (0, generateToken_1.default)(user._id, res);
            logger_1.default.info("Password Changed Successfully");
            (0, responseService_1.handleSuccessMessage)(res, 200, "Password Changed Successfully", { token });
        }
        else {
            logger_1.default.error("Invalid user data");
            (0, responseService_1.handleErrorMessage)(res, 400, "Invalid user data");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
const employeeInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().select('fullName email phone role');
        (0, responseService_1.handleSuccessMessage)(res, 200, 'Users retrieved successfully', users);
    }
    catch (error) {
        next(error);
    }
});
exports.employeeInfo = employeeInfo;
const employeeInfoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield user_model_1.default.findById(userId).select('fullName email phone role isFirstTimeUser');
        (0, responseService_1.handleSuccessMessage)(res, 200, 'Users information successfully', user);
    }
    catch (error) {
        next(error);
    }
});
exports.employeeInfoById = employeeInfoById;
