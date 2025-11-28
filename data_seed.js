// seed_schedules.js
// Run: node seed_schedules.js
// This version matches your real Schedule schema used in src/models/Schedule.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/education?directConnection=true";

// ---- SCHEMAS ----
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "staff", "student"], required: true },
    yearNo: Number,
    semesterNo: Number,
    batch: String,
  },
  { timestamps: true }
);

const scheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    yearNo: Number,
    semesterNo: Number,
    batch: String,
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Schedule = mongoose.model("Schedule", scheduleSchema);

// ---- HELPERS ----
const addHours = (date, hrs) => new Date(date.getTime() + hrs * 3600000);
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash("Password@123", salt);

async function upsertUser({ name, email, role, yearNo, semesterNo, batch }) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  return User.create({
    name,
    email,
    password: hashed,
    role,
    yearNo,
    semesterNo,
    batch,
  });
}

// ---- MAIN SEED ----
async function main() {
  console.log("Connecting to:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected");

  const admin = await upsertUser({
    name: "Admin One",
    email: "admin@example.com",
    role: "admin",
  });

  const staff = await upsertUser({
    name: "Staff Jane",
    email: "staff@example.com",
    role: "staff",
  });

  const student1 = await upsertUser({
    name: "Stu Alpha",
    email: "stu1@example.com",
    role: "student",
    yearNo: 2,
    semesterNo: 3,
    batch: "A",
  });

  const student2 = await upsertUser({
    name: "Stu Beta",
    email: "stu2@example.com",
    role: "student",
    yearNo: 2,
    semesterNo: 3,
    batch: "A",
  });

  console.log("Seeded users:", {
    admin: admin._id.toString(),
    staff: staff._id.toString(),
    student1: student1._id.toString(),
    student2: student2._id.toString(),
  });

  // Clean old schedules created by this staff/admin
  await Schedule.deleteMany({ createdBy: { $in: [admin._id, staff._id] } });

  const now = new Date();
  const schedules = [
    {
      title: "Math – Algebra Intro",
      description: "Quadratic equations basics",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, 24),
      endAt: addHours(now, 25),
      attendees: [student1._id, student2._id],
      createdBy: staff._id,
    },
    {
      title: "Science – Physics Lab",
      description: "Newton’s laws experiment",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, 28),
      endAt: addHours(now, 30),
      attendees: [student1._id],
      createdBy: staff._id,
    },
    {
      title: "English – Essay Workshop",
      description: "Structure and thesis",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, 48),
      endAt: addHours(now, 49),
      attendees: [student2._id],
      createdBy: staff._id,
    },
    {
      title: "Computer – JS Basics",
      description: "Variables & loops",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, 52),
      endAt: addHours(now, 54),
      attendees: [student1._id, student2._id],
      createdBy: staff._id,
    },
    {
      title: "History – Ancient Rome",
      description: "Republic to Empire",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, -24),
      endAt: addHours(now, -23),
      attendees: [student1._id],
      createdBy: staff._id,
    },
    {
      title: "Chemistry – Safety Briefing",
      description: "Lab safety rules",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, 10),
      endAt: addHours(now, 11),
      attendees: [student2._id],
      createdBy: staff._id,
    },
    {
      title: "Math – Algebra Chapter 2",
      description: "Factoring",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, 72),
      endAt: addHours(now, 73),
      attendees: [student1._id],
      createdBy: staff._id,
    },
    {
      title: "Sports – Football Practice",
      description: "Drills and scrimmage",
      yearNo: 2,
      semesterNo: 3,
      batch: "A",
      startAt: addHours(now, 80),
      endAt: addHours(now, 82),
      attendees: [student1._id, student2._id],
      createdBy: staff._id,
    },
  ];

  const result = await Schedule.insertMany(schedules);
  console.log(`✅ Inserted ${result.length} schedules`);

  await mongoose.disconnect();
  console.log("✅ Done!");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
});
