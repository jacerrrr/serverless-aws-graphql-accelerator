/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PubSubEngine } from 'type-graphql';

import { AppLogger } from '@core';
import { DynamoDBClient } from '@db';
import { environment } from '@environment';
import { GQLSubscriptionRepository } from '@repo';
import { WSEventService } from '@service';

/** GraphQL PubSub implementation that only supports publishing */
export class PublishClient extends PubSubEngine {
  private static instance: PublishClient;

  static getInstance(): PubSubEngine {
    if (PublishClient.instance == null) {
      PublishClient.instance = new PublishClient(
        new WSEventService(
          new GQLSubscriptionRepository(environment, new AppLogger(environment), DynamoDBClient.getInstance()),
        ),
      );
    }
    return PublishClient.instance;
  }

  async publish(triggerName: string, payload: any): Promise<void> {
    return this.events.publish({ event: triggerName, payload });
  }

  async subscribe(triggerName: string, onMessage: Function, options: Record<string, any>): Promise<number> {
    throw new Error('Subscribe is not supported! Use SubscriptionClient.');
  }

  async unsubscribe(subId: number): Promise<void> {
    throw new Error('Unsubscribe is not supported! Use SubscriptionClient.');
  }

  private constructor(private readonly events: WSEventService) {
    super();
  }
}
