import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAsyncIterator, isAsyncIterable } from 'iterall';
import { OperationMessage } from 'subscriptions-transport-ws';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';

import { container, DI_ENVIRONMENT, DI_LOGGER } from '@ioc';
import { gqlEnvironment } from '@environment';
import { InvalidOperationError, MalformedOperationError } from '@graphql/errors';
import { generateSchema } from '@graphql/schema';
import { subscribe } from '@graphql/subscribe';
import { WSConnectionService, WSSubscriptionService } from '@service';
import { LoggerInterface } from '@util';

import { wsSendError, wsSendSuccess } from './ws-protocol';

/* Set handler specific environment */
container.set(DI_ENVIRONMENT, gqlEnvironment);

const loggerClass = 'WSServerHandler';
const logger = container.get<LoggerInterface>(DI_LOGGER);

const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const supportedOpTypes = [
    MessageTypes.GQL_CONNECTION_INIT,
    MessageTypes.GQL_START,
    MessageTypes.GQL_STOP,
    MessageTypes.GQL_CONNECTION_TERMINATE,
  ];
  if (event.body == null) {
    // serverless-plugin-warmup call
    return Promise.resolve({ statusCode: 500, body: 'Not a Websocket request!' });
  }
  const operation: OperationMessage = JSON.parse(event.body);

  if (typeof operation !== 'object' && operation != null) {
    throw new MalformedOperationError();
  }

  if (operation.type == null) {
    throw new MalformedOperationError('Type is missing');
  }

  if (supportedOpTypes.findIndex(t => t === operation.type) === -1) {
    throw new InvalidOperationError(`Only ${supportedOpTypes.join(', ')} operations are accepted`);
  }

  if (operation.type === MessageTypes.GQL_CONNECTION_INIT) {
    return wsSendSuccess(MessageTypes.GQL_CONNECTION_ACK);
  }

  const subscriptions = container.get<WSSubscriptionService>(WSSubscriptionService);
  const connections = container.get<WSConnectionService>(WSConnectionService);
  const conn = await connections.hydrate(event.requestContext.connectionId as string);
  switch (operation.type) {
    case MessageTypes.GQL_START:
      global['schema'] = global['schema'] || (await generateSchema());
      const schema = global['schema']; // eslint-disable-line no-case-declarations
      const iterable = await subscribe(schema, operation, conn.connection, true); // eslint-disable-line no-case-declarations
      if (!isAsyncIterable(iterable)) {
        const message = 'Subscription result did not return AsyncIterable. Record will not be processed.';
        logger.error(message, iterable, loggerClass);
        return wsSendError(new Error(message));
      }
      const iterator = getAsyncIterator(iterable); // eslint-disable-line no-case-declarations
      await iterator.next();
      return wsSendSuccess(MessageTypes.GQL_DATA, operation.id, { data: {} });
    case MessageTypes.GQL_STOP:
      await subscriptions.unsubscribe(conn.connection, operation.id as string);
      return wsSendSuccess(MessageTypes.GQL_COMPLETE, operation.id);
    default:
      logger.warn('WS sent message without mappable response!', {}, loggerClass);
      return wsSendError(operation.payload as object, MessageTypes.GQL_ERROR, operation.id as string);
  }
};

export { handler };
