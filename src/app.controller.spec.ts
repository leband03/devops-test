import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckResponse } from './response.dto';

describe('AppController', () => {
  let appController: AppController;
  let appServiceMock: jest.Mocked<
    Pick<AppService, 'getHealthCheck' | 'executeTest'>
  >;

  beforeEach(async () => {
    appServiceMock = {
      getHealthCheck: jest.fn(),
      executeTest: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appServiceMock }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return health check', () => {
      const result = {
        status: 'healthy',
        ts: Date.now(),
      } satisfies HealthCheckResponse;
      appServiceMock.getHealthCheck.mockReturnValue(result);

      const resultHealthCheckResponse = appController.getHealthCheck();

      expect(appServiceMock.getHealthCheck).toHaveBeenCalledTimes(1);
      expect(resultHealthCheckResponse).toEqual(result);
    });
  });

  describe('test', () => {
    it('should delegate to AppService.executeTest', () => {
      const result = { ok: true, value: 0.123 };
      appServiceMock.executeTest.mockReturnValue(result);

      const response = appController.getTest();

      expect(appServiceMock.executeTest).toHaveBeenCalledTimes(1);
      expect(response).toEqual(result);
    });

    it('should propagate errors thrown by AppService.executeTest', () => {
      const err = new Error('Fake request failed');
      appServiceMock.executeTest.mockImplementation(() => {
        throw err;
      });

      expect(() => appController.getTest()).toThrow(err);
    });
  });
});
