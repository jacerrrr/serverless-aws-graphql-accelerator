import 'reflect-metadata';

import { APIGatewayEvent } from 'aws-lambda';

import { container, DI_ENVIRONMENT } from '@ioc';
import { environment } from '@environment';
import { WSConnectionService } from '@service';

/* Set handler specific environment */
container.set(DI_ENVIRONMENT, environment);

const handler = async (event: APIGatewayEvent): Promise<void> => {
  const connections = container.get(WSConnectionService);
  await connections.deregister(event.requestContext.connectionId as string);
};

export { handler };
