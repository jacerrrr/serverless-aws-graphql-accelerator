import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda';

import { container, DI_ENVIRONMENT, DI_LOGGER } from '@ioc';
import { gqlPlaygroundEnvironment as environment } from '@environment';
import { GQLContext } from '@graphql/context';
import { generateSchema } from '@graphql/schema';
import { LoggerInterface } from '@util';

/* Set handler specific environment */
container.set(DI_ENVIRONMENT, environment);

const loggerClass = 'GraphQLServerHandler';
const logger = container.get<LoggerInterface>(DI_LOGGER);

const bootstrap = async (
  event: APIGatewayEvent,
): Promise<(event: APIGatewayEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => void> => {
  global['schema'] = global['schema'] || (await generateSchema()); // tslint:disable-line
  const schema = global['schema']; // tslint:disable-line

  // Ignore warmup requests w no headers
  if (event.headers === undefined) {
    return Promise.resolve(() => {
      return;
    });
  }

  const server = new ApolloServer({
    context: (): GQLContext => {
      const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // uuid-like
      const reqContainer = container.of(requestId); // get scoped container
      const context = {
        requestId,
        container: reqContainer,
        // Pass in user to the context here
      };
      reqContainer.set('context', context); // place context or other data in container
      return context;
    },
    introspection: true,
    playground: {
      endpoint: environment.httpUrl,
      subscriptionEndpoint: environment.wsUrl,
    },
    plugins: [
      {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        requestDidStart: () => ({
          willSendResponse(rq): void {
            // remember to dispose the scoped container to prevent memory leaks
            container.reset(rq.context.requestId);
          },
        }),
      },
    ],
    schema,
  });
  return server.createHandler({
    cors: {
      origin: environment.origin,
      maxAge: 86400,
    },
  });
};

const runHandler = async (
  event: APIGatewayEvent,
  context: Context,
  handler: (event: APIGatewayEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => void,
): Promise<void> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callback = (error: any, body: any): void => {
      if (error) {
        logger.error('Failed to run GraphQL handler', error, loggerClass);
        reject(error);
      }

      resolve(body);
    };

    handler(event, context, callback);
  });

const handler = async (event: APIGatewayEvent, context: Context): Promise<void> => {
  const gqlHandler = await bootstrap(event);
  return runHandler(event, context, gqlHandler);
};

export { handler };
