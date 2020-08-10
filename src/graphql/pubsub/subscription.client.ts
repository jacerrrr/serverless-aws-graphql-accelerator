/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLResolveInfo } from 'graphql';
import { ResolverFn } from 'graphql-subscriptions';
import { $$asyncIterator, createAsyncIterator } from 'iterall';
import { OperationMessagePayload } from 'subscriptions-transport-ws';

import { AppLogger } from '@core';
import { DynamoDBClient } from '@db';
import { environment } from '@environment';
import { GQLSubscription } from '@model';
import { GQLSubscriptionRepository } from '@repo';
import { WSSubscriptionService } from '@service';

import { GQLSubscriptionContext } from '../context';

export type SubscribeResolveFn = (
  rootValue: any,
  args: any,
  context: GQLSubscriptionContext,
  info: GraphQLResolveInfo,
) => Promise<AsyncIterator<any>>;

/** GraphQL PubSub implementation that only supports subscribing */
export class SubscriptionClient {
  private static instance: SubscriptionClient;

  static getInstance(): SubscriptionClient {
    if (SubscriptionClient.instance == null) {
      SubscriptionClient.instance = new SubscriptionClient(
        new WSSubscriptionService(
          new GQLSubscriptionRepository(new AppLogger(environment), DynamoDBClient.getInstance()),
        ),
      );
    }

    return SubscriptionClient.instance;
  }

  subscribe(eventNames: string | Array<string>): ResolverFn {
    // eslint-disable-next-line
    return (rootValue: any, args: any, context: GQLSubscriptionContext, info: GraphQLResolveInfo) => {
      const names = Array.isArray(eventNames) ? eventNames : [eventNames];
      let promises: Array<Promise<GQLSubscription>> = [];
      if (context.$$internal.registerSubscriptions) {
        const payload = context.$$internal.operation.payload as OperationMessagePayload;
        promises = names.map(n =>
          this.subscriptions.subscribe({
            event: n,
            connection: context.$$internal.connection,
            operationId: context.$$internal.operation.id as string,
            query: payload.query as string,
            variables: payload.variables ? payload.variables : {},
            operationName: payload.operationName as string,
          }),
        );
      }
      return {
        async next(): Promise<IteratorResult<any>> {
          if (promises.length > 0) {
            return Promise.all(promises).then(ss => createAsyncIterator(ss.map(s => s.event)).next());
          }
          return context.$$internal.pubSub.asyncIterator(names).next();
        },
        async throw(error): Promise<IteratorResult<any>> {
          return Promise.reject(error);
        },
        async return(): Promise<IteratorResult<any>> {
          return Promise.resolve({ value: undefined, done: true });
        },
        [$$asyncIterator](): AsyncIterator<any> {
          return this;
        },
      };
    };
  }

  private constructor(private readonly subscriptions: WSSubscriptionService) {}
}
