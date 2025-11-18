import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { loginValidator } from '../utils/validators.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/login', loginValidator, validate, login);

export default router;
