import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/env.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminUser = await prisma.adminUser.findUnique({ where: { email } });

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email },
      config.jwtSecret,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
