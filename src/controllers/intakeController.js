import { prisma } from '../config/prisma.js';

const buildFilters = ({ status, startDate, endDate, state, companyName }) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (state) {
    where.state = state;
  }

  if (companyName) {
    where.companyName = {
      contains: companyName,
      mode: 'insensitive',
    };
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  return where;
};

export const createIntake = async (req, res, next) => {
  try {
    const data = req.body;
    const intake = await prisma.intake.create({ data });
    res.status(201).json(intake);
  } catch (error) {
    next(error);
  }
};

export const listIntakes = async (req, res, next) => {
  try {
    const { status, startDate, endDate, state, companyName } = req.query;
    const where = buildFilters({ status, startDate, endDate, state, companyName });
    const intakes = await prisma.intake.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(intakes);
  } catch (error) {
    next(error);
  }
};

export const getIntakeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const intake = await prisma.intake.findUnique({ where: { id } });
    if (!intake) {
      return res.status(404).json({ message: 'Intake not found' });
    }
    res.json(intake);
  } catch (error) {
    next(error);
  }
};

export const updateIntake = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.intake.update({ where: { id }, data });
    res.json(updated);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Intake not found' });
    }
    next(error);
  }
};

export const deleteIntake = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.intake.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Intake not found' });
    }
    next(error);
  }
};
