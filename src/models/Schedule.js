import mongoose from 'mongoose';


const scheduleSchema = new mongoose.Schema(
{
title: { type: String, required: true },
description: String,
yearNo: { type: Number, required: true },
semesterNo: { type: Number, required: true },
batch: { type: String, required: true },
startAt: { type: Date, required: true },
endAt: { type: Date, required: true },
attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
{ timestamps: true }
);


scheduleSchema.index({ title: 'text', description: 'text' });


export default mongoose.model('Schedule', scheduleSchema);