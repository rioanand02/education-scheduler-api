import Schedule from '../models/Schedule.js';


export async function createSchedule(payload) {
return Schedule.create(payload);
}


export async function updateSchedule(id, updates) {
return Schedule.findByIdAndUpdate(id, updates, { new: true });
}


export async function deleteSchedule(id) {
return Schedule.findByIdAndDelete(id);
}


export async function getScheduleById(id) {
return Schedule.findById(id).populate('createdBy attendees', 'name email role');
}


export async function listSchedules(filter, { page = 1, limit = 20 }) {
const skip = (page - 1) * limit;
const query = Schedule.find(filter)
.sort({ startAt: 1 })
.skip(skip)
.limit(limit)
.populate('createdBy', 'name email role');


const [items, total] = await Promise.all([query, Schedule.countDocuments(filter)]);
return {
items,
meta: { total, page, limit, pages: Math.ceil(total / limit) }
};
}