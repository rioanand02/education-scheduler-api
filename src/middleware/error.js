import httpStatus from 'http-status';
import ApiResponse from '../utils/ApiResponse.js';


export function notFound(req, res) {
res.status(httpStatus.NOT_FOUND).json(new ApiResponse({ success: false, message: 'Not Found' }));
}


export function errorHandler(err, req, res, next) {
const status = err.statusCode || 500;
const message = err.message || 'Internal Server Error';
console.error(err);
res.status(status).json(new ApiResponse({ success: false, message }));
}