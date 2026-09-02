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

import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/update-purchase-status.dto';
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

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEMBER, Role.ADMIN)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Purchases' })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Purchase Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Purchase not found')
  @SwaggerUnauthorized()
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Purchase',
    description: 'With items in one request',
  })
  @ApiBody({ type: CreatePurchaseDto })
  @SwaggerCreated({ message: 'Purchase created successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerConflict('Invoice number already exists')
  @SwaggerUnauthorized()
  create(@Body() dto: CreatePurchaseDto) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update Purchase Status',
    description: 'Admin only',
  })
  @ApiBody({ type: UpdatePurchaseStatusDto })
  @SwaggerSuccess({ message: 'Purchase status updated successfully', data: {} })
  @SwaggerBadRequest(
    'Purchase already completed/cancelled, cannot change status',
  )
  @SwaggerNotFound('Purchase not found')
  @SwaggerForbidden('Only admin can update purchase status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePurchaseStatusDto) {
    return this.service.updateStatus(id, dto);
  }
}
