"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorMessage = exports.handleSuccessMessage = void 0;
const handleSuccessMessage = (res, code, msg, response, additional = {}) => {
    const success = Object.assign({ message: msg, status: true, statusCode: code, response }, additional);
    return res.status(200).json(success);
};
exports.handleSuccessMessage = handleSuccessMessage;
const handleErrorMessage = (res, code, msg, additional = {}) => {
    const error = Object.assign({ message: msg || 'Something went wrong. Please try again later.', status: false, statusCode: code || 500, response: 'failed' }, additional);
    return res.status(200).json(error);
};
exports.handleErrorMessage = handleErrorMessage;
