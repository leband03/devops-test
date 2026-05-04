import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthCheckResponse} from "./response.dto";

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
        appService = app.get<AppService>(AppService);
    });

    describe('health', () => {
        it('should return health check', () => {
            const result = {status: 'healthy', ts: Date.now()} satisfies HealthCheckResponse;
            jest.spyOn(appService, 'getHealthCheck').mockReturnValue(result);

            const resultHealthCheckResponse = appController.getHealthCheck();

            expect(appService.getHealthCheck).toHaveBeenCalledTimes(1);
            expect(resultHealthCheckResponse).toEqual(result);
        });
    });
});
