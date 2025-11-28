📘 Education Scheduler API (Express + MongoDB)

In your project folder, follow these steps to set up and run the application 👇

⚙️ Setup Instructions
1️⃣ Install dependencies
npm i -S

2️⃣ Run the server

For development

npm run dev


For production

npm run start

3️⃣ Reset / Update Super Admin password

If you need to reset or update the Super Admin password, use:

npm run reset-admin

🔑 Default Login Credentials (from seed.js)
Admins (all):    password = Admin@123
Staff  (all):    password = Staff@123
Students (all):  password = Student@123

For Security 

Implemented Rate Limiting so if you enter wrong password more than five(5) times, you IP will block.
Then, you can try to login only after 15 minutes

🗂️ Notes & Access Rules

Admin can:

Create staff & students

View, update, delete any user

View and manage all schedules


Staff can:

Create, update, and delete only their own schedules

View all schedules


Students can:

View only schedules related to them,
based on their yearNo, semesterNo, batch or if they are in attendees[].

🧹 Deleting Data

Delete User:
Use the user’s _id (MongoDB ObjectId)

DELETE /api/users/:id


Delete Schedule:
Use the schedule’s _id.
Only the staff who created it or an admin can delete or modify it.

DELETE /api/schedules/:id

✅ Health Check

Test server status:

GET http://localhost:3000/health

💡 Tip

Import the Postman collection included in the repo (postman_collection.json) 
You can import this file from post man and you can check all these api's
for ready-to-test APIs: login, create users, manage schedules, etc.

That’s it 🎉 — you’re ready to use the Education Scheduler API!