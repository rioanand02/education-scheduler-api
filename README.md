📘 Education Scheduler API (Express + MongoDB + Atlas)

A role-based education management REST API built with Node.js (Express) and MongoDB Atlas, including authentication, schedules, and access control for Admins, Staff, and Students.

⚙️ Setup Instructions
1️⃣ Install dependencies

In your project folder:

npm i -S

2️⃣ Database (MongoDB Atlas)

The application is configured to connect to MongoDB Atlas automatically.

You don’t need to run MongoDB locally — the connection string is already set in your .env file as:

MONGO_URI=mongodb+srv://<your_user>:<your_password>@<your_cluster>.mongodb.net/education

Replace the <your_user>, <your_password>, and <your_cluster> with your actual Atlas credentials.

✅ When the app starts, it automatically connects to your Atlas cluster.

3️⃣ Run the server

For development

npm run dev

For production

npm run start

The API will run at:
👉 http://localhost:3000

4️⃣ Reset / Update Super Admin password

If you ever need to reset or update the Super Admin password:

npm run reset-admin

🔑 Default Login Credentials (from data_seed.js)
Admins (all): password = Admin@123
Staff (all): password = Staff@123
Students (all): password = Student@123

🛡️ Security – Rate Limiting

A rate limiter is applied to the login route for security.

If the same IP fails to log in more than 5 times within 15 minutes,
it will be temporarily blocked.
You can try again after 15 minutes.

🗂️ Notes & Access Rules
👑 Admin can:

Create staff & students

View, update, and delete any user

View and manage all schedules

👨‍🏫 Staff can:

Create, update, and delete only their own schedules

View all schedules

👩‍🎓 Students can:

View only schedules related to them, based on:

yearNo

semesterNo

batch

or if they appear in attendees[]

🧹 Deleting Data

Delete User:
Use the user’s \_id (MongoDB ObjectId)

DELETE /api/users/:id

Delete Schedule:
Use the schedule’s \_id.
Only the staff who created the schedule or an admin can delete or modify it.

DELETE /api/schedules/:id

✅ Health Check

You can test if the API is up and connected to MongoDB:

GET  http://localhost:3000           or 
GET  http://localhost:3000/health

Expected response:

{
"status": "ok",
"message": "Education Scheduler API is running"
}

💡 Postman – How to Import and Test APIs

Open Postman

Click Import → File

Select the provided file:
📄 postman_collection.json

Click Import

You’ll see a collection named
“Education Scheduler – Full Flow (Seeded)”

Now you can test:

Admin login, user management

Staff schedule creation and listing

Student schedule viewing

User update/delete

All requests are pre-configured with sample data and tokens.

🧠 Assumptions Made

MongoDB Atlas is used as the default database (no local setup required).

Admins are responsible for creating all Staff and Students.

Students can only view schedules; they cannot modify them.

Each Staff member can modify or delete only schedules they created.

Authentication is JWT-based and required for all routes.

Rate limiting is applied only to login attempts (5 per 15 minutes per IP).

That’s it 🎉
Your Education Scheduler API is ready to run, connect, and test seamlessly with MongoDB Atlas and Postman!
