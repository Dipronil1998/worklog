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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const responseService_1 = require("../utils/responseService");
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            (0, responseService_1.handleErrorMessage)(res, 401, 'Unauthorized - No Token Provided');
            return;
        }
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            (0, responseService_1.handleErrorMessage)(res, 401, 'Unauthorized - Invalid Token');
            return;
        }
        const user = yield user_model_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            (0, responseService_1.handleErrorMessage)(res, 404, 'User not found');
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = protectRoute;
