"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = void 0;
const formatDuration = (durationMs) => {
    durationMs = Number(durationMs);
    console.log(durationMs);
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
exports.formatDuration = formatDuration;
