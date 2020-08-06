import { Service } from 'typedi';

import { FindService, ResourceService } from '../resource.service';

import { HelloMapper } from './hello.mapper';
import { Hello } from './hello.model';

@Service()
export class HelloService extends ResourceService implements FindService<Hello> {
  constructor(private readonly mapper: HelloMapper) {
    super();
  }

  getWorld(): Promise<Hello> {
    return Promise.resolve({ uid: `${Math.random()}`, name: 'world' });
  }

  find(uid: string): Promise<Hello> {
    return Promise.resolve(this.mapper.toModel(uid));
  }
}
