import express from "express";
import { login, logout, employeeCreate, changePassword, employeeInfo,employeeInfoById } from "../controllers/auth.controller";
import protectRoute from "../middleware/protectRoute";
import { adminPermission } from "../middleware/adminPermission";

const router = express.Router();

router.post("/employee",protectRoute, adminPermission, employeeCreate);

router.post("/login", login);

router.post("/logout", protectRoute,logout);

router.post("/changePassword", protectRoute, changePassword);

router.get("/employee", protectRoute,employeeInfo);

router.get("/employee/:id", protectRoute, adminPermission,employeeInfoById);

export default router;