import rateLimit from 'express-rate-limit';

// 5 login attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // allow 5 tries
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  
});
