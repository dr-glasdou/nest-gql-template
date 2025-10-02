import { config } from 'dotenv';
import path from 'node:path';
import type { PrismaConfig } from 'prisma';

config({ path: '.env' });

export default {
  schema: path.join('src', 'prisma'),
} satisfies PrismaConfig;
