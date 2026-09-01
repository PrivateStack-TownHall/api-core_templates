import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';

import { SwaggerSuccess } from '../../common/swagger/swagger-response';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get latest activities',
  })
  @SwaggerSuccess({
    success: true,
    data: [
      {
        id: 'order-12',
        type: 'ORDER_CREATED',
        entity: 'Order',
        title: '#12',
        description: 'Order PENDING',
        createdAt: '2026-06-18T01:00:00.000Z',
        application: 'Kings Brew',
      },
      {
        id: 'product-5',
        type: 'PRODUCT_CREATED',
        entity: 'Product',
        title: 'Espresso',
        description: 'New product created',
        createdAt: '2026-06-18T00:00:00.000Z',
        application: 'Kings Brew',
      },
    ],
  })
  getActivities() {
    return this.activitiesService.getActivities();
  }
}
