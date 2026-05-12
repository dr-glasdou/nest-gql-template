import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import type { HealthDto } from './dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  get(): HealthDto {
    this.logger.log('Health check invoked');
    return { message: 'OK' };
  }

  async checkDBConnection(): Promise<string> {
    this.logger.debug('Checking database connection...');
    await this.prisma.$queryRaw`SELECT 1`;
    return 'connected';
  }
}
