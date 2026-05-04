import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';
import { HealthCheckResponse } from './response.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectPinoLogger(AppService.name) private readonly logger: PinoLogger,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    void this.startFakeRequests();
  }

  getHealthCheck(): HealthCheckResponse {
    return {
      status: 'healthy',
      ts: Date.now(),
    };
  }

  executeTest() {
    const value = Math.random();
    const threshold = 0.5;

    if (value > threshold) {
      throw new InternalServerErrorException('Fake request failed');
    }

    this.logger.info({ value, threshold }, 'fake request succeeded');
    return { ok: true, value };
  }

  async startFakeRequests() {
    this.logger.info('starting fake request loop in 3s');
    await this.asyncWait(3000);

    for (let i = 0; i < 1000; i++) {
      try {
        this.logger.debug({ iteration: i }, 'fake request dispatch');
        await lastValueFrom(
          this.httpService.get(`http://localhost:3000/test`),
        );
      } catch (err) {}

      await this.asyncWait(1000);
    }
  }

  private asyncWait(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
