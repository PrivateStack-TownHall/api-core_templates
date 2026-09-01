import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../prisma/prisma.module';

import { PublicFavoritesController } from './public-favorites.controller';
import { PublicFavoritesService } from './public-favorites.service';

@Module({
  imports: [PrismaModule],
  controllers: [PublicFavoritesController],
  providers: [PublicFavoritesService],
  exports: [PublicFavoritesService],
})
export class PublicFavoritesModule {}
