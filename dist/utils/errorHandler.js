"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const responseService_1 = require("./responseService");
class HttpError extends Error {
}
const errorHandler = (err, req, res, next) => {
    res.locals.message = err.message || "Please try again after some time";
    const status = 200;
    return (0, responseService_1.handleErrorMessage)(res, status, res.locals.message);
};
exports.errorHandler = errorHandler;
