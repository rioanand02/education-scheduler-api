// scripts/reset-admin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const uri = process.env.MONGO_URI

(async () => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    const email = 'anand@gmail.com';        // change if needed
    const plain = 'Anand@123';              // desired login password

    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email---->', email);
      process.exit(1);
    }

    user.password = plain
    await user.save(); // we have hash this password

    console.log('Password reset OK for', email);
  } catch (err) {
    console.error('Reset failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
