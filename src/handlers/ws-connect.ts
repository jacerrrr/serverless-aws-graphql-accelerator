import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';

import { container, DI_ENVIRONMENT, DI_LOGGER } from '@ioc';
import { LambdaLogger } from '@core';
import { environment } from '@environment';
import { HandlerHelper } from '@helper/handler.helper';
import { WSConnectionService } from '@service';

/* Set handler specific environment */
container.set({ id: DI_ENVIRONMENT, factory: () => environment });

const deriveEndpoint = (apiId: string, region: string, stage: string): string =>
  `${apiId}.execute-api.${region}.amazonaws.com/${stage}`;

const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const logger = container.get<LambdaLogger>(DI_LOGGER);
  try {
    if (event.requestContext == null) {
      // serverless-plugin-warmup
      return Promise.resolve({ statusCode: 500, body: 'Not a Websocket request!' });
    }
    const connectionService = container.get(WSConnectionService);
    await connectionService.register({
      connection: event.requestContext.connectionId as string,
      endpoint: deriveEndpoint(event.requestContext.apiId, environment.region, event.requestContext.stage),
    });
    return HandlerHelper.wsSendSuccess(MessageTypes.GQL_CONNECTION_KEEP_ALIVE);
  } catch (e) {
    logger.error('Error occurred within handler.', e);
    return HandlerHelper.wsSendError(e, MessageTypes.GQL_CONNECTION_ERROR);
  }
};

export { handler };
