import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AuditLogsService } from './audit-logs.service';
import {
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Audit Logs', description: 'Admin only' })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can view audit logs')
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get Audit Logs By User' })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can view audit logs')
  findByUser(@Param('userId') userId: string) {
    return this.auditLogsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Audit Log Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Audit log not found')
  @SwaggerForbidden('Only admin can view audit logs')
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }
}
