import { Prisma, PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export * from './api-handler';
export * from './error-handler';
export * from './jwt-middleware';
export * from './omit';
export * from './users-repo';
export * from './PreferenceRepo';

