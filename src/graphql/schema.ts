import { GraphQLSchema } from 'graphql';
import { buildSchema, ResolverData } from 'type-graphql';

import { GQLContext } from './context';
import { ErrorInterceptorMiddleware } from './middlewares';
import { PublishClient } from './pubsub';
import { HelloResolver } from './resolvers';

// Uncomment for a custom authentication checker
// export const authChecker: AuthChecker<GQLContext> = ({ context }, roles) =>
//   context.user !== undefined && (roles.length === 0 || context.user.roles.some(role => roles.includes(role)));

// Define any enums here
// const enums = (): void => {
//   registerEnumType(PropertyTypeId, {
//     name: 'PropertyTypeId',
//     description: 'Commerical Real Estate unique property types',
//   });
// };

export const generateSchema = async (): Promise<GraphQLSchema> => {
  // enums(); // Apply enums to schema
  return buildSchema({
    resolvers: [HelloResolver],
    pubSub: PublishClient.getInstance(),
    dateScalarMode: 'isoDate',
    // authChecker, // Add authChecker to graphql instance
    globalMiddlewares: [ErrorInterceptorMiddleware],
    container: ({ context }: ResolverData<GQLContext>) => context.container,
  });
};
