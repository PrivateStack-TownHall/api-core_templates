import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../prisma/prisma.module';

import { PublicCartController } from './public-cart.controller';
import { PublicCartService } from './public-cart.service';

@Module({
  imports: [PrismaModule],
  controllers: [PublicCartController],
  providers: [PublicCartService],
  exports: [PublicCartService],
})
export class PublicCartModule {}
