import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Stocks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEMBER, Role.ADMIN)
@Controller('stocks')
export class StocksController {
  constructor(private readonly service: StocksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Stocks',
    description: 'Filter by ?warehouseId= & ?productId=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(
    @Query('warehouseId') warehouseId?: string,
    @Query('productId') productId?: string,
  ) {
    return this.service.findAll(warehouseId, productId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Stock Detail',
    description: 'Includes last 20 movements',
  })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Stock not found')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Stock Record' })
  @ApiBody({ type: CreateStockDto })
  @SwaggerCreated({ message: 'Stock record created successfully', data: {} })
  @SwaggerUnauthorized()
  create(@Body() dto: CreateStockDto) {
    return this.service.create(dto);
  }

  @Patch(':id/adjust')
  @ApiOperation({
    summary: 'Adjust Stock Quantity',
    description: 'Creates a Movement record automatically',
  })
  @ApiBody({ type: AdjustStockDto })
  @SwaggerSuccess({ message: 'Stock adjusted successfully', data: {} })
  @SwaggerBadRequest('Resulting stock quantity cannot be negative')
  @SwaggerUnauthorized()
  @SwaggerNotFound('Stock not found')
  adjust(@Param('id') id: string, @Body() dto: AdjustStockDto) {
    return this.service.adjust(id, dto);
  }
}
