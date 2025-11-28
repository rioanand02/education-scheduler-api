import mongoose from 'mongoose';
import { env } from '../config/env.js';


export async function connectDB() {
mongoose.set('strictQuery', true);
await mongoose.connect(env.mongoUri);

mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error', err));
}