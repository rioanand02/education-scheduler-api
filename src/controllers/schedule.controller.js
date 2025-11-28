import httpStatus from 'http-status';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Schedule from '../models/Schedule.js';
import { ROLES } from '../models/User.js';
import {
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleById
} from '../services/schedule.service.js';

// Create schedule (staff/admin)
export const create = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      yearNo: req.body.yearNo,
      semesterNo: req.body.semesterNo,
      batch: req.body.batch,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      attendees: req.body.attendees || [],
      createdBy: req.user._id
    };

    // quick sanity checks
    if (!payload.title) throw new ApiError(httpStatus.BAD_REQUEST, 'title is required');
    if (!payload.yearNo) throw new ApiError(httpStatus.BAD_REQUEST, 'yearNo is required');
    if (!payload.semesterNo) throw new ApiError(httpStatus.BAD_REQUEST, 'semesterNo is required');
    if (!payload.batch) throw new ApiError(httpStatus.BAD_REQUEST, 'batch is required');
    if (!payload.startAt || !payload.endAt) throw new ApiError(httpStatus.BAD_REQUEST, 'startAt and endAt are required');

    const doc = await createSchedule(payload);
    res.status(httpStatus.CREATED).json(new ApiResponse({ message: 'Schedule created', data: doc }));
  } catch (e) {
    next(e);
  }
};

// List schedules (admin/staff/student) with filters/search/pagination
export const list = async (req, res, next) => {
  try {
    const { s, yearNo, semesterNo, batch, from, to, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (yearNo) filter.yearNo = Number(yearNo);
    if (semesterNo) filter.semesterNo = Number(semesterNo);
    if (batch) filter.batch = batch;

    // date range on startAt
    if (from || to) filter.startAt = {};
    if (from) filter.startAt.$gte = new Date(from);
    if (to) filter.startAt.$lte = new Date(to);

    // students only see relevant schedules
    if (req.user.role === ROLES.STUDENT) {
      filter.$or = [
        { attendees: req.user._id },
        { yearNo: req.user.yearNo, semesterNo: req.user.semesterNo, batch: req.user.batch }
      ];
    }

    // text search on title/description
    let finalFilter = filter;
    if (s) {
      finalFilter = { $and: [filter, { $text: { $search: s } }] };
    }

    const result = await listSchedules(finalFilter, {
      page: Number(page),
      limit: Number(limit)
    });

    res.json(new ApiResponse({ data: result.items, meta: result.meta }));
  } catch (e) {
    next(e);
  }
};

// Get one schedule by id (authorized; students only if relevant)
export const getOne = async (req, res, next) => {
  try {
    const doc = await getScheduleById(req.params.id);
    console.log(req.params.id)
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');

    if (req.user.role === ROLES.STUDENT) {
      const isAttendee = doc.attendees?.some((u) => u._id?.equals?.(req.user._id) || u.equals?.(req.user._id));
      const isCohortMatch =
        doc.yearNo === req.user.yearNo &&
        doc.semesterNo === req.user.semesterNo &&
        doc.batch === req.user.batch;

      if (!isAttendee && !isCohortMatch) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
    }

    res.json(new ApiResponse({ data: doc }));
  } catch (e) {
    next(e);
  }
};

// Update schedule (owner staff or admin)
export const patch = async (req, res, next) => {
  try {
    const existing = await Schedule.findById(req.params.id);
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');

    const isOwner = existing.createdBy?.equals?.(req.user._id);
    const isAdmin = req.user.role === ROLES.ADMIN;
    if (!isOwner && !isAdmin) throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');

    const updates = {};
    const fields = [
      'title',
      'description',
      'yearNo',
      'semesterNo',
      'batch',
      'startAt',
      'endAt',
      'attendees'
    ];
    fields.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const updated = await updateSchedule(existing._id, updates);
    res.json(new ApiResponse({ message: 'Updated', data: updated }));
  } catch (e) {
    next(e);
  }
};

// Delete schedule (owner staff or admin)
export const remove = async (req, res, next) => {
  try {
    const existing = await Schedule.findById(req.params.id);
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');

    const isOwner = existing.createdBy?.equals?.(req.user._id);
    const isAdmin = req.user.role === ROLES.ADMIN;
    if (!isOwner && !isAdmin) throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');

    await deleteSchedule(existing._id);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (e) {
    next(e);
  }
};
