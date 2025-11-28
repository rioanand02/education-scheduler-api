import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


export const ROLES = {
ADMIN: 'admin',
STAFF: 'staff',
STUDENT: 'student'
};


const userSchema = new mongoose.Schema(
{
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
yearNo: Number,
semesterNo: Number,
batch: String
},
{ timestamps: true }
);


userSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});


userSchema.methods.comparePassword = function (plain) {
return bcrypt.compare(plain, this.password);
};


userSchema.methods.toJSON = function () {
const obj = this.toObject();
delete obj.password;
return obj;
};


export default mongoose.model('User', userSchema);