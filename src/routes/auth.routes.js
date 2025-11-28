import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { requireAuth, permit } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Public
router.post('/login',loginLimiter, login);

// Admin-only user creation (staff/students)
router.post('/register', requireAuth, permit(ROLES.ADMIN), register);

export default router;
