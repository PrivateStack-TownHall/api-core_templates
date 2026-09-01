import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../prisma/prisma.module';

import { PublicPaymentsController } from './public-payments.controller';
import { PublicPaymentsService } from './public-payments.service';

@Module({
  imports: [PrismaModule],
  controllers: [PublicPaymentsController],
  providers: [PublicPaymentsService],
  exports: [PublicPaymentsService],
})
export class PublicPaymentsModule {}
