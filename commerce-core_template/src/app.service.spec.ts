import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getHello returns the literal string "Hello World!"', () => {
    // Note: AppController no longer calls this method (it returns its own
    // { message: 'Kings Brew API', feature: ... } object directly), so this
    // service is currently unused dead code kept for completeness.
    expect(service.getHello()).toBe('Hello World!');
  });
});
