import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get My Notifications' })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  findMine(@Req() req: AuthRequest) {
    return this.notificationsService.findMine(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark One Notification as Read' })
  @SwaggerSuccess({ message: 'Notification marked as read', data: {} })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Notification not found')
  markRead(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.notificationsService.markRead(id, req.user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark All Notifications as Read' })
  @SwaggerSuccess({ message: 'All notifications marked as read' })
  @SwaggerUnauthorized()
  markAllRead(@Req() req: AuthRequest) {
    return this.notificationsService.markAllRead(req.user.id);
  }
}
