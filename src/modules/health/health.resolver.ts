import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CustomException } from 'src/exceptions';
import { HealthDto, TestErrorDto } from './dto';
import { HealthService } from './health.service';

@Resolver(() => HealthDto)
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => HealthDto, { name: 'healthCheck' })
  healthCheck(): HealthDto {
    return this.healthService.get();
  }

  @Query(() => String, { name: 'errorCheck' })
  errorCheck(): string {
    throw new CustomException({
      message: 'Test error in HealthResolver',
      status: HttpStatus.BAD_REQUEST,
    });
  }

  @Mutation(() => String, { name: 'testError' })
  testError(@Args('dto') dto: TestErrorDto): string {
    return `Received: ${dto.test}`;
  }

  @Query(() => String, { name: 'checkDBConnection' })
  checkDBConnection(): Promise<string> {
    return this.healthService.checkDBConnection();
  }
}
