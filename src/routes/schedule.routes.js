import { Router } from 'express';
import { requireAuth, permit } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';
import { create, list, getOne, patch, remove } from '../controllers/schedule.controller.js';

const router = Router();

router.use(requireAuth);

// Create (staff/admin)
router.post('/', permit(ROLES.STAFF, ROLES.ADMIN), create);

// List (admin/staff/student) with filters & search via query params
router.get('/', permit(ROLES.ADMIN, ROLES.STAFF, ROLES.STUDENT), list);

// Get by ID (admin/staff/student) — controller restricts students to relevant schedules
router.get('/:id', permit(ROLES.ADMIN, ROLES.STAFF, ROLES.STUDENT), getOne);

// Update (owner staff or admin) — controller checks ownership/admin
router.patch('/:id', permit(ROLES.ADMIN, ROLES.STAFF), patch);

// Delete (owner staff or admin) — controller checks ownership/admin
router.delete('/:id', permit(ROLES.ADMIN, ROLES.STAFF), remove);

export default router;
