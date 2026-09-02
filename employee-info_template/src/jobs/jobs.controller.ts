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
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

import { JobsService } from './jobs.service';
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

class JobDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  title!: string;
  @ApiProperty({ example: 8000000 }) @IsInt() @Min(0) minSalary!: number;
  @ApiProperty({ example: 20000000 }) @IsInt() @Min(0) maxSalary!: number;
}

class UpdateJobDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) minSalary?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) maxSalary?: number;
}

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Jobs' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Job Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Job not found')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Job', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Job created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create job')
  create(@Body() dto: JobDto) {
    return this.jobsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Job', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Job updated successfully', data: {} })
  @SwaggerNotFound('Job not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update job')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Job', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Job deleted successfully' })
  @SwaggerNotFound('Job not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete job')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
