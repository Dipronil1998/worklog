"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageNotFound = void 0;
// Extend the Error class to include a status property
class HttpError extends Error {
}
const pageNotFound = (req, res, next) => {
    const err = new HttpError("Page not found");
    err.status = 404;
    next(err);
};
exports.pageNotFound = pageNotFound;
