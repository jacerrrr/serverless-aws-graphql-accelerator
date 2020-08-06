import 'reflect-metadata';

import { APIGatewayEvent } from 'aws-lambda';

import { container } from '@ioc';
import { WSConnectionService } from '@service';

const handler = async (event: APIGatewayEvent): Promise<void> => {
  const connections = container.get(WSConnectionService);
  await connections.deregister(event.requestContext.connectionId as string);
};

export { handler };
