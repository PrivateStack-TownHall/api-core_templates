import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferStatusDto } from './dto/update-transfer-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerBadRequest,
  SwaggerConflict,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEMBER, Role.ADMIN)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly service: TransfersService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Transfers' })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Transfer Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Transfer not found')
  @SwaggerUnauthorized()
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Transfer',
    description: 'With items in one request',
  })
  @ApiBody({ type: CreateTransferDto })
  @SwaggerCreated({ message: 'Transfer created successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerConflict('Transfer code already exists')
  @SwaggerUnauthorized()
  create(@Body() dto: CreateTransferDto) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update Transfer Status',
    description:
      'Admin only. Setting COMPLETED actually moves the stock between warehouses.',
  })
  @ApiBody({ type: UpdateTransferStatusDto })
  @SwaggerSuccess({ message: 'Transfer status updated successfully', data: {} })
  @SwaggerBadRequest('Insufficient stock for product in source warehouse')
  @SwaggerNotFound('Transfer not found')
  @SwaggerForbidden('Only admin can update transfer status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTransferStatusDto) {
    return this.service.updateStatus(id, dto);
  }
}
