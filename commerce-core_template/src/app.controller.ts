import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

import { SwaggerSuccess } from './common/swagger/swagger-response';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API Info',
    description: 'Basic info about the Kings Brew API',
  })
  @SwaggerSuccess({
    success: true,
    message: 'Kings Brew API',
    feature: 'Observability api public',
  })
  getHello(): { message: string; feature: string } {
    return {
      message: 'Kings Brew API',
      feature: 'Observability api public',
    };
  }
}
