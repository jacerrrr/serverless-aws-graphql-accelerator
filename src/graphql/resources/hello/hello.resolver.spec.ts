import 'reflect-metadata';

import { LoggerFake } from '@test/fakes';

import { HelloMapper } from './hello.mapper';
import { HelloResolver } from './hello.resolver';
import { HelloService } from './hello.service';

describe('HelloResolver', () => {
  const fakeLogger = new LoggerFake();
  let helloService: HelloService;
  let testSubject: HelloResolver;

  beforeEach(() => {
    helloService = new HelloService(new HelloMapper());
    testSubject = new HelloResolver(fakeLogger, helloService);
  });

  it('should say hello', async () => {
    const model = { uid: '1', name: 'Me' };
    spyOn(helloService, 'find').and.resolveTo(model);
    const result = await testSubject.hello(model.name);
    expect(result).toBe(model);
  });

  it('should say hello to the world', async () => {
    spyOn(helloService, 'getWorld').and.callThrough();
    await testSubject.helloWorld();
    expect(helloService.getWorld).toHaveBeenCalled();
  });
});
