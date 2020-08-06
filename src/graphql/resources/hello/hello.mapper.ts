import { Service } from 'typedi';

import { ResourceModelMapper } from '@graphql/resources/resource.mapper';

import { Hello } from './hello.model';

@Service({ global: true })
export class HelloMapper implements ResourceModelMapper<Hello, string> {
  toModel(entity: string): Hello {
    return { uid: `${Math.random()}`, name: entity };
  }
}
