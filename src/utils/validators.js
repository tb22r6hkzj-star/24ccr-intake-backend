import { body, param, query } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password is required'),
];

export const intakeCreateValidator = [
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('contactName').notEmpty().withMessage('Contact name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('industry').notEmpty().withMessage('Industry is required'),
  body('annualRevenueRange').notEmpty().withMessage('Annual revenue range is required'),
  body('netWorthRange').notEmpty().withMessage('Net worth range is required'),
  body('liquidityRange').notEmpty().withMessage('Liquidity range is required'),
  body('fundingNeed').notEmpty().withMessage('Funding need is required'),
  body('useOfFunds').notEmpty().withMessage('Use of funds is required'),
  body('timeHorizonMonths').isInt({ min: 0 }).withMessage('Time horizon must be an integer'),
  body('status').optional().isIn(['NEW', 'REVIEWING', 'QUALIFIED', 'NOT_A_FIT']).withMessage('Invalid status'),
];

export const intakeUpdateValidator = [
  param('id').isUUID().withMessage('Valid intake ID is required'),
  body('status').optional().isIn(['NEW', 'REVIEWING', 'QUALIFIED', 'NOT_A_FIT']).withMessage('Invalid status'),
  body('timeHorizonMonths').optional().isInt({ min: 0 }).withMessage('Time horizon must be an integer'),
];

export const intakeIdValidator = [
  param('id').isUUID().withMessage('Valid intake ID is required'),
];

export const intakeQueryValidator = [
  query('status').optional().isIn(['NEW', 'REVIEWING', 'QUALIFIED', 'NOT_A_FIT']).withMessage('Invalid status'),
  query('startDate').optional().isISO8601().withMessage('startDate must be ISO8601'),
  query('endDate').optional().isISO8601().withMessage('endDate must be ISO8601'),
  query('state').optional().isLength({ min: 2, max: 2 }).withMessage('State must be two letters'),
  query('companyName').optional().isString(),
];
