import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { requireAuth, permit } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';

const router = Router();

// Public
router.post('/login', login);

// Admin-only user creation (staff/students)
router.post('/register', requireAuth, permit(ROLES.ADMIN), register);

export default router;
