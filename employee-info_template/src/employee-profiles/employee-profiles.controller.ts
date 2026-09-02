import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { EmployeeProfilesService } from './employee-profiles.service';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerBadRequest,
  SwaggerConflict,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Employee Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employee-profiles')
export class EmployeeProfilesController {
  constructor(
    private readonly employeeProfilesService: EmployeeProfilesService,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get All Employee Profiles',
    description: 'Admin only',
  })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can view all employee profiles')
  findAll() {
    return this.employeeProfilesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Employee Profile Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Employee profile not found')
  findOne(@Param('id') id: string) {
    return this.employeeProfilesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create Employee Profile',
    description: 'Admin only - attach HR data to a registered user',
  })
  @ApiBody({ type: CreateEmployeeProfileDto })
  @SwaggerSuccess({
    message: 'Employee profile created successfully',
    data: {},
  })
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  @SwaggerConflict('This user already has an employee profile')
  @SwaggerForbidden('Only admin can create employee profile')
  create(@Body() dto: CreateEmployeeProfileDto) {
    return this.employeeProfilesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Employee Profile',
    description: 'Self (own profile) or admin',
  })
  @ApiBody({ type: UpdateEmployeeProfileDto })
  @SwaggerSuccess({
    message: 'Employee profile updated successfully',
    data: {},
  })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Employee profile not found')
  @SwaggerForbidden('You can only update your own profile')
  async update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdateEmployeeProfileDto,
  ) {
    await this.assertSelfOrAdmin(id, req);
    return this.employeeProfilesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete Employee Profile',
    description: 'Admin only',
  })
  @SwaggerSuccess({ message: 'Employee profile deleted successfully' })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Employee profile not found')
  @SwaggerForbidden('Only admin can delete employee profile')
  remove(@Param('id') id: string) {
    return this.employeeProfilesService.remove(id);
  }

  private async assertSelfOrAdmin(id: string, req: AuthRequest) {
    if (req.user.role === Role.ADMIN) return;

    const { data: profile } = await this.employeeProfilesService.findOne(id);
    if (profile.userId !== req.user.id) {
      throw new ForbiddenException('You can only update your own profile');
    }
  }
}
