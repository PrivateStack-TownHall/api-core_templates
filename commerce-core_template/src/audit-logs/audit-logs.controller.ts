import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

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

// Audit trail across ALL users' actions — admin-only by nature.
@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Audit Logs',
    description: 'Retrieve all audit logs ordered by latest first (admin only)',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        userId: 1,
        action: 'LOGIN',
        entity: 'User',
        entityId: '1',
        oldData: null,
        newData: null,
        ipAddress: null,
        createdAt: '2026-06-17T04:00:00.000Z',
      },
    ],
  })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can view audit logs')
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get Audit Logs By User',
    description: 'Retrieve audit logs for a specific user',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        userId: 1,
        action: 'LOGIN',
        entity: 'User',
        entityId: '1',
      },
    ],
  })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can view audit logs')
  findByUser(
    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.auditLogsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Audit Log',
    description: 'Retrieve audit log detail by id',
  })
  @SwaggerSuccess({
    data: {
      id: 1,
      userId: 1,
      action: 'LOGIN',
      entity: 'User',
      entityId: '1',
      oldData: null,
      newData: null,
      ipAddress: null,
      createdAt: '2026-06-17T04:00:00.000Z',
    },
  })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Audit log not found')
  @SwaggerForbidden('Only admin can view audit logs')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.auditLogsService.findOne(id);
  }
}
