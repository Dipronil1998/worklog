"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const adminPermission_1 = require("../middleware/adminPermission");
const router = express_1.default.Router();
router.post("/employee", protectRoute_1.default, adminPermission_1.adminPermission, auth_controller_1.employeeCreate);
router.post("/login", auth_controller_1.login);
router.post("/logout", protectRoute_1.default, auth_controller_1.logout);
router.post("/changePassword", protectRoute_1.default, auth_controller_1.changePassword);
router.get("/employee", protectRoute_1.default, adminPermission_1.adminPermission, auth_controller_1.employeeInfo);
router.get("/employee/:id", protectRoute_1.default, adminPermission_1.adminPermission, auth_controller_1.employeeInfoById);
exports.default = router;
