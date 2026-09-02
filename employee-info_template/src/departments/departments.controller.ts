import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

class DepartmentDto {
  @ApiProperty() @IsUUID() locationId!: string;
  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

class UpdateDepartmentDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() locationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Departments' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Department Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Department not found')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Department', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Department created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create department')
  create(@Body() dto: DepartmentDto) {
    return this.departmentsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Department', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Department updated successfully', data: {} })
  @SwaggerNotFound('Department not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update department')
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Department', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Department deleted successfully' })
  @SwaggerNotFound('Department not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete department')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
