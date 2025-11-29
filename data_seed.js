// seed.js
// Run: node seed.js
// Creates 3 admins, 6 staff, 10 students, and 12 schedules that match your API schema.

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/education?directConnection=true";

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
    yearNo: { type: Number, required: true },
    semesterNo: { type: Number, required: true },
    batch: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Schedule = mongoose.model("Schedule", scheduleSchema);

const addHours = (d, h) => new Date(d.getTime() + h * 3600000);

const cohorts = [
  { yearNo: 1, semesterNo: 1, batch: "A" },
  { yearNo: 1, semesterNo: 1, batch: "B" },
  { yearNo: 2, semesterNo: 3, batch: "A" },
  { yearNo: 2, semesterNo: 3, batch: "B" },
  { yearNo: 3, semesterNo: 5, batch: "A" },
  { yearNo: 3, semesterNo: 5, batch: "B" },
];

async function hash(pw) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pw, salt);
}

async function createUsers() {

  await User.deleteMany({});

  // Admins
  const adminPw = await hash("Admin@123");
  const admins = await User.insertMany([
    { name: "Admin One",   email: "admin1@example.com", password: adminPw, role: "admin" },
    { name: "Admin Two",   email: "admin2@example.com", password: adminPw, role: "admin" },
    { name: "Admin Three", email: "admin3@example.com", password: adminPw, role: "admin" },
  ]);

  // Staff
  const staffPw = await hash("Staff@123");
  const staffs = await User.insertMany([
    { name: "Staff A", email: "staff1@example.com", password: staffPw, role: "staff" },
    { name: "Staff B", email: "staff2@example.com", password: staffPw, role: "staff" },
    { name: "Staff C", email: "staff3@example.com", password: staffPw, role: "staff" },
    { name: "Staff D", email: "staff4@example.com", password: staffPw, role: "staff" },
    { name: "Staff E", email: "staff5@example.com", password: staffPw, role: "staff" },
    { name: "Staff F", email: "staff6@example.com", password: staffPw, role: "staff" },
  ]);

  // Students (10)
  const studentPw = await hash("Student@123");
  const studentsPayload = [];
  const names = [
    "Alice", "Bob", "Charlie", "Daisy", "Ethan",
    "Fiona", "George", "Hannah", "Ivan", "Julia"
  ];
  for (let i = 0; i < 10; i++) {
    const c = cohorts[i % cohorts.length];
    studentsPayload.push({
      name: `${names[i]} Student`,
      email: `student${i + 1}@example.com`,
      password: studentPw,
      role: "student",
      yearNo: c.yearNo,
      semesterNo: c.semesterNo,
      batch: c.batch,
    });
  }
  const students = await User.insertMany(studentsPayload);

  return { admins, staffs, students };
}

function buildSchedules(staffs, students) {
  const now = new Date();
 
  const schedCohorts = [
    { yearNo: 1, semesterNo: 1, batch: "A" },
    { yearNo: 1, semesterNo: 1, batch: "B" },
    { yearNo: 2, semesterNo: 3, batch: "A" },
    { yearNo: 2, semesterNo: 3, batch: "B" },
    { yearNo: 3, semesterNo: 5, batch: "A" },
    { yearNo: 3, semesterNo: 5, batch: "B" },
  ];

  const pickStaff = (i) => staffs[i % staffs.length]._id;
  const pickStudentsForCohort = (yearNo, semesterNo, batch, limit = 3) => {
    const filtered = students.filter(
      (s) => s.yearNo === yearNo && s.semesterNo === semesterNo && s.batch === batch
    );
    return filtered.slice(0, limit).map((s) => s._id);
  };

  // 12 schedules 
  const titles = [
    "Orientation & Welcome",
    "Mathematics – Algebra Basics",
    "Physics – Motion & Forces",
    "Chemistry – Lab Safety",
    "English – Essay Workshop",
    "Computer – JavaScript Intro",
    "History – Ancient Civilizations",
    "Biology – Cell Structure",
    "Economics – Supply & Demand",
    "Art – Color Theory",
    "Sports – Football Practice",
    "CS – Data Structures Basics"
  ];

  const descs = [
    "General overview and rules",
    "Quadratics and factoring",
    "Newton’s laws introduction",
    "Safety briefing and PPE",
    "Structure and thesis writing",
    "Variables, loops, and arrays",
    "From Mesopotamia to Rome",
    "Cells, organelles and functions",
    "Market basics and curves",
    "Hue, saturation, value",
    "Warm-ups and scrimmage",
    "Arrays, stacks, and queues",
  ];


  const offsets = [-72, -24, -6, 6, 12, 24, 36, 48, 72, 120, 168, 240];

  const payload = [];
  for (let i = 0; i < 12; i++) {
    const cohort = schedCohorts[i % schedCohorts.length];
    const staffId = pickStaff(i);
    const start = addHours(now, offsets[i]);
    const end = addHours(now, offsets[i] + 2);
    const att = pickStudentsForCohort(cohort.yearNo, cohort.semesterNo, cohort.batch, 4);

    payload.push({
      title: titles[i],
      description: descs[i],
      yearNo: cohort.yearNo,
      semesterNo: cohort.semesterNo,
      batch: cohort.batch,
      startAt: start,
      endAt: end,
      attendees: att,
      createdBy: staffId,
    });
  }

  return payload;
}

async function seed() {
  console.log("Connecting to:", MONGO_URI);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("MongoDB connected");

  await Schedule.deleteMany({});
  const { admins, staffs, students } = await createUsers();

  const schedules = buildSchedules(staffs, students);
  await Schedule.insertMany(schedules);

  console.log("Seeded:");

  await mongoose.disconnect();
  console.log("Disconnected==================");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
