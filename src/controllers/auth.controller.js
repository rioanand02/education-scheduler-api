import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User, { ROLES } from '../models/User.js';
import { signToken } from '../services/auth.service.js';


export const register = async (req, res, next) => {
try {
const { name, email, password, role, yearNo, semesterNo, batch } = req.body;
const exists = await User.findOne({ email });
if (exists) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
const user = await User.create({ name, email, password, role, yearNo, semesterNo, batch });
res.status(httpStatus.CREATED).json(new ApiResponse({ message: 'User created', data: user }));
} catch (e) { next(e); }
};


export const login = async (req, res, next) => {
try {
const { email, password } = req.body;
console.log(email, password)
const user = await User.findOne({ email });
console.log(user)
if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
const ok = await user.comparePassword(password);
console.log(ok)
if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
const token = signToken({ sub: user._id, role: user.role });
res.json(new ApiResponse({ message: 'Logged in', data: { token, user } }));
} catch (e) { next(e); }
};