import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User, { ROLES } from '../models/User.js';
import { pick } from '../utils/pick.js';

// List users (admin)
export const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const p = Number(page);
    const l = Number(limit);
    const skip = (p - 1) * l;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(l).sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);

    res.json(
      new ApiResponse({
        data: users,
        meta: { total, page: p, limit: l, pages: Math.ceil(total / l) }
      })
    );
  } catch (e) {
    next(e);
  }
};

// Get user (admin or self) – route must enforce isSelfOrAdmin
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    res.json(new ApiResponse({ data: user }));
  } catch (e) {
    next(e);
  }
};

// Update user (admin or self). Admin may change role; others cannot.
export const updateUser = async (req, res, next) => {
  try {
    const allowed = ['name', 'password', 'yearNo', 'semesterNo', 'batch'];
    if (req.user.role === ROLES.ADMIN) allowed.push('role');

    const updates = pick(req.body, allowed);
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    Object.assign(user, updates);
    await user.save();

    res.json(new ApiResponse({ message: 'Updated', data: user }));
  } catch (e) {
    next(e);
  }
};

// Delete user (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    res.status(httpStatus.NO_CONTENT).send();
  } catch (e) {
    next(e);
  }
};
