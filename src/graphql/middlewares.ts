import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

import { GQLContext } from './context';

export class ErrorInterceptorMiddleware implements MiddlewareInterface<GQLContext> {
  async use(_: ResolverData<GQLContext>, next: NextFn): Promise<void> {
    try {
      await next();
    } catch (err) {
      console.error(err, _.context, _.info);
      throw err;
    }
  }
}
