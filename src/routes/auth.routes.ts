import express from "express";
import { login, logout, employeeCreate, changePassword, employeeInfo } from "../controllers/auth.controller";
import protectRoute from "../middleware/protectRoute";
import { adminPermission } from "../middleware/adminPermission";

const router = express.Router();

router.post("/employeeCreate", employeeCreate);

router.post("/login", login);

router.post("/logout", protectRoute,logout);

router.post("/changePassword", protectRoute, changePassword);

router.get("/employee", protectRoute, adminPermission,employeeInfo);

export default router;