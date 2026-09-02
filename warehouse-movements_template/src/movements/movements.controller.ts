import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MovementsService } from './movements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEMBER, Role.ADMIN)
@Controller('movements')
export class MovementsController {
  constructor(private readonly service: MovementsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Movements',
    description: 'Audit trail of stock changes - filter by ?stockId=',
  })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  findAll(@Query('stockId') stockId?: string) {
    return this.service.findAll(stockId);
  }
}
