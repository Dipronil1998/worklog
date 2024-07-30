"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connectToMongoDB_1 = __importDefault(require("./db/connectToMongoDB"));
const pageNotFound_1 = require("./utils/pageNotFound");
const errorHandler_1 = require("./utils/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const worklog_routes_1 = __importDefault(require("./routes/worklog.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
dotenv_1.default.config();
const port = process.env.PORT || 3000;
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('index1');
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/project", project_routes_1.default);
app.use("/api/worklog", worklog_routes_1.default);
app.use(pageNotFound_1.pageNotFound);
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    (0, connectToMongoDB_1.default)();
    console.log(`Server is running at http://localhost:${port}`);
});
