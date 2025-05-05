import { Module } from '@nestjs/common';
import { IssuancePointService } from './issuance-point.service';
import { IssuancePointController } from './issuance-point.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [IssuancePointController],
  providers: [IssuancePointService, PrismaService],
})
export class IssuancePointModule {}
