/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DynamoDBStreamEvent } from 'aws-lambda';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { ExecutionResult } from 'graphql';
import { createAsyncIterator, getAsyncIterator, isAsyncIterable } from 'iterall';
import { OperationMessage } from 'subscriptions-transport-ws';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';
import { PubSubEngine } from 'type-graphql';

import { container, DI_ENVIRONMENT, DI_LOGGER } from '@ioc';
import { LambdaLogger } from '@core';
import { environment } from '@environment';
import { generateSchema } from '@graphql/schema';
import { subscribe } from '@graphql/subscribe';
import { WSEvent } from '@model';
import { WSConnectionService, WSEventService } from '@service';
import { WSSubscriptionService } from '@service';
import { WSUtil } from '@util/ws.util';

/* Set handler specific environment */
container.set(DI_ENVIRONMENT, environment);

class PubSub implements PubSubEngine {
  constructor(private readonly events: Array<WSEvent>) {
    this.events = events;
  }

  async publish(triggerName: string, payload: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async subscribe(triggerName: string, onMessage: Function, options: Record<string, any>): Promise<number> {
    throw new Error('Method not implemented.');
  }
  async unsubscribe(subId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  asyncIterator(eventNames: string | Array<string>): AsyncIterator<any> {
    const names = Array.isArray(eventNames) ? eventNames : [eventNames];
    return createAsyncIterator(this.events.filter(event => names.includes(event.event)).map(event => event.payload));
  }
}

const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const logger = container.get<LambdaLogger>(DI_LOGGER);
  global['schema'] = global['schema'] || (await generateSchema()); // tslint:disable-line
  const schema = global['schema']; // tslint:disable-line
  const connections = container.get<WSConnectionService>(WSConnectionService);
  const subscriptions = container.get<WSSubscriptionService>(WSSubscriptionService);
  const events = container.get<WSEventService>(WSEventService);
  for (const record of event.Records) {
    if (record.eventName !== 'INSERT') {
      continue;
    } // Only check inserts
    if (
      !(
        record.dynamodb &&
        record.dynamodb.Keys &&
        record.dynamodb.Keys.pk.S &&
        record.dynamodb.Keys.sk.S &&
        record.dynamodb.NewImage &&
        record.dynamodb.Keys.pk.S.indexOf('EVENT') !== -1
      )
    ) {
      continue;
    } // Key check for events only

    try {
      const subscriptionEvent = Converter.unmarshall(record.dynamodb.NewImage) as WSEvent;
      const subscribers = await subscriptions.subscribersByEvent(WSUtil.parseWSEntity(record.dynamodb.Keys.sk.S));
      const promises = subscribers.map(async s => {
        const conn = await connections.hydrate(s.connection);
        const pubSub = new PubSub([subscriptionEvent]);
        const operation: OperationMessage = {
          id: s.operationId,
          type: MessageTypes.GQL_DATA,
          payload: {
            operationName: s.operationName,
            query: s.query,
            variables: s.variables,
          },
        };
        const iterable = await subscribe(schema, operation, s.connection, false, pubSub);
        if (!isAsyncIterable(iterable)) {
          logger.error(
            'Subscription result did not return AsyncIterable. Record will not be processed.',
            subscriptionEvent,
          );
          return Promise.resolve();
        }

        const iterator = getAsyncIterator(iterable);
        const result: IteratorResult<ExecutionResult> = await iterator.next();
        if (result.value != null) {
          const payload: OperationMessage = {
            type: MessageTypes.GQL_DATA,
            id: s.operationId,
            payload: result.value,
          };
          return connections.broadcast(conn, JSON.stringify(payload));
        }
      });

      await Promise.all(promises);
      await events.remove(record.dynamodb.Keys.pk.S, record.dynamodb.Keys.sk.S);
    } catch (e) {
      logger.error('Processing DynamoDB stream event failed. Event will be skipped', e);
      continue;
    }
  }
};

export { handler };
