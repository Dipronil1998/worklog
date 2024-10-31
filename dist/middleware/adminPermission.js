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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPermission = void 0;
const responseService_1 = require("../utils/responseService");
const adminPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    if ((user === null || user === void 0 ? void 0 : user.role) === 'manager' || (user === null || user === void 0 ? void 0 : user.role) === 'team_lead') {
        next();
    }
    else {
        (0, responseService_1.handleErrorMessage)(res, 403, "You donot have permission.");
    }
});
exports.adminPermission = adminPermission;
