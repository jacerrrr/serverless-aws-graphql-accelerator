import { HelloMapper } from './hello.mapper';
import { HelloService } from './hello.service';

describe('HelloService', () => {
  let helloMapper: HelloMapper;
  let testSubject: HelloService;

  beforeEach(() => {
    helloMapper = new HelloMapper();
    testSubject = new HelloService(helloMapper);
  });

  it('should say hello to the world', async () => {
    const worldResult = await testSubject.getWorld();
    expect(worldResult.name).toBe('world');
  });

  it('should say hello to anyone', async () => {
    const anyone = 'anyone';
    spyOn(helloMapper, 'toModel').and.callThrough();
    const anyoneResult = await testSubject.find(anyone);
    expect(helloMapper.toModel).toHaveBeenCalledWith(anyone);
    expect(anyoneResult.name).toBe(anyone);
  });
});
