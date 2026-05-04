import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckResponse } from './response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealthCheck(): HealthCheckResponse {
    return this.appService.getHealthCheck();
  }

  @Get('test')
  getTest() {
    return this.appService.executeTest();
  }
}
