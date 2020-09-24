/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLResolveInfo } from 'graphql';
import { ResolverFn } from 'graphql-subscriptions';
import { $$asyncIterator } from 'iterall';

import { GQLSubscriptionContext } from '@graphql/context';

export type FilterFn = (
  rootValue?: any,
  args?: any,
  context?: GQLSubscriptionContext,
  info?: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const withFilter = (asyncIteratorFn: ResolverFn, filterFn: FilterFn): ResolverFn => (
  rootValue: any,
  args: any,
  context: GQLSubscriptionContext,
  info: GraphQLResolveInfo,
) => {
  const asyncIterator = asyncIteratorFn(rootValue, args, context, info);
  const getNextPromise = async (): Promise<IteratorResult<any>> => {
    const payload = await asyncIterator.next();
    if (payload.done) {
      return payload;
    }
    if (payload.value !== null && typeof payload.value === 'object') {
      return payload;
    }

    const filterResult = await Promise.resolve(filterFn(payload.value, args, context, info));
    if (filterResult) {
      return payload;
    }

    // Skip the current value and wait for the next one
    return getNextPromise();
  };

  return {
    async next(): Promise<IteratorResult<any>> {
      return getNextPromise();
    },
    async return(): Promise<IteratorResult<any>> {
      return asyncIterator.return!(); // eslint-disable-line
    },
    async throw(error: any): Promise<IteratorResult<any>> {
      return asyncIterator.throw!(error); // eslint-disable-line
    },
    [$$asyncIterator](): AsyncIterator<any> {
      return this; // eslint-disable-line
    },
  };
};

export { withFilter };
