import { Router } from 'express';
import { requireAuth, permit, isSelfOrAdmin } from '../middleware/auth.js';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { ROLES } from '../models/User.js';

const router = Router();

router.use(requireAuth);

// Admin only
router.get('/', permit(ROLES.ADMIN), listUsers);
router.delete('/:id', permit(ROLES.ADMIN), deleteUser);

// Admin or Self
router.get('/:id', isSelfOrAdmin('id'), getUser);
router.patch('/:id', isSelfOrAdmin('id'), updateUser);

export default router;
