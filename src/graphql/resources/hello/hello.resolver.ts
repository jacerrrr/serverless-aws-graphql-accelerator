import { Arg, Mutation, Publisher, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Inject } from 'typedi';

import { DI_LOGGER } from '@ioc';
import { LambdaLogger } from '@core';
import { SubscriptionClient, Topic, withFilter } from '@graphql/pubsub';

import { Hello } from './hello.model';
import { HelloService } from './hello.service';

@Resolver(() => Hello)
export class HelloResolver {
  constructor(@Inject(DI_LOGGER) private readonly logger: LambdaLogger, private readonly helloService: HelloService) {}

  @Query(() => Hello)
  async helloWorld(): Promise<Hello> {
    this.logger.info('hello world called', {}, this.constructor.name);
    return this.helloService.getWorld();
  }

  @Query(() => Hello)
  async hello(@Arg('name') name: string): Promise<Hello> {
    this.logger.info('hello() called', { name }, this.constructor.name);
    return this.helloService.find(name);
  }

  @Mutation(() => Hello)
  async helloAll(
    @Arg('audience') audience: string,
    @PubSub(Topic.HELLO_EVERYONE) publish: Publisher<string>,
  ): Promise<Hello> {
    const model = await this.helloService.find(audience);
    await publish(audience);
    return model;
  }

  @Subscription(() => Hello, {
    subscribe: withFilter(SubscriptionClient.getInstance().subscribe(Topic.HELLO_EVERYONE), () => true),
  })
  helloEveryone(@Root() audience: string): Hello {
    return { uid: `${Math.random()}`, name: audience };
  }
}
