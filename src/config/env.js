import dotenv from 'dotenv';
dotenv.config();


export const env = {
node: process.env.NODE_ENV || 'development',
port: process.env.PORT || 3000,
mongoUri: process.env.MONGO_URI,
jwt: {
secret: process.env.JWT_SECRET,
expiresIn: process.env.JWT_EXPIRES_IN || '1h'
}
};


if (!env.mongoUri) throw new Error('MONGO_URI is required');
if (!env.jwt.secret) throw new Error('JWT_SECRET is required');