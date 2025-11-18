import { Router } from 'express';
import {
  createIntake,
  listIntakes,
  getIntakeById,
  updateIntake,
  deleteIntake,
} from '../controllers/intakeController.js';
import {
  intakeCreateValidator,
  intakeUpdateValidator,
  intakeIdValidator,
  intakeQueryValidator,
} from '../utils/validators.js';
import { validate } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', intakeCreateValidator, validate, createIntake);
router.get('/', authenticate, intakeQueryValidator, validate, listIntakes);
router.get('/:id', authenticate, intakeIdValidator, validate, getIntakeById);
router.patch('/:id', authenticate, intakeUpdateValidator, validate, updateIntake);
router.delete('/:id', authenticate, intakeIdValidator, validate, deleteIntake);

export default router;
