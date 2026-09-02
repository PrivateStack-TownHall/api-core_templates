import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DependentsService } from './dependents.service';
import { CreateDependentDto } from './dto/create-dependent.dto';
import { UpdateDependentDto } from './dto/update-dependent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../common/enums/role.enum';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Dependents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DependentsController {
  constructor(private readonly dependentsService: DependentsService) {}

  @Get('employee-profiles/:employeeId/dependents')
  @ApiOperation({ summary: 'Get Dependents of an Employee' })
  @SwaggerSuccess({ data: [] })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.dependentsService.findByEmployee(employeeId);
  }

  @Post('dependents')
  @ApiOperation({
    summary: 'Add Dependent',
    description: 'Self (own profile) or admin',
  })
  @ApiBody({ type: CreateDependentDto })
  @SwaggerCreated({ message: 'Dependent added successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Employee profile not found')
  @SwaggerForbidden('You can only add dependents to your own profile')
  create(@Req() req: AuthRequest, @Body() dto: CreateDependentDto) {
    return this.dependentsService.create(
      req.user.id,
      req.user.role === Role.ADMIN,
      dto,
    );
  }

  @Patch('dependents/:id')
  @ApiOperation({
    summary: 'Update Dependent',
    description: 'Self (own profile) or admin',
  })
  @ApiBody({ type: UpdateDependentDto })
  @SwaggerSuccess({ message: 'Dependent updated successfully', data: {} })
  @SwaggerNotFound('Dependent not found')
  @SwaggerForbidden('You can only update your own dependents')
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdateDependentDto,
  ) {
    return this.dependentsService.update(
      id,
      req.user.id,
      req.user.role === Role.ADMIN,
      dto,
    );
  }

  @Delete('dependents/:id')
  @ApiOperation({
    summary: 'Delete Dependent',
    description: 'Self (own profile) or admin',
  })
  @SwaggerSuccess({ message: 'Dependent deleted successfully' })
  @SwaggerNotFound('Dependent not found')
  @SwaggerForbidden('You can only delete your own dependents')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.dependentsService.remove(
      id,
      req.user.id,
      req.user.role === Role.ADMIN,
    );
  }
}
