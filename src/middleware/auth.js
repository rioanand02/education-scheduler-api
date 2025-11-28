import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../services/auth.service.js';
import User, { ROLES } from '../models/User.js';


export async function requireAuth(req, res, next) {
try {
const header = req.headers.authorization || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
const payload = verifyToken(token);
console.log(payload)
const user = await User.findById(payload.sub);
if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
req.user = user;
next();
} catch (e) {
next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
}
}


export function permit(...roles) {
return (req, res, next) => {
if (!req.user) return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
if (!roles.includes(req.user.role)) return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
next();
};
}


export function isSelfOrAdmin(paramKey = 'id') {
return (req, res, next) => {
const isAdmin = req.user.role === ROLES.ADMIN;
const isSelf = req.user._id.toString() === (req.params[paramKey] || '').toString();
if (!isAdmin && !isSelf) return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
next();
};
}