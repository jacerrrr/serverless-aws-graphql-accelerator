import ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi';
import { Inject, Service } from 'typedi';

import { DI_LOGGER } from '@ioc';
import { LambdaLogger } from '@core';
import { WSConnection } from '@model';
import { GQLSubscriptionRepository } from '@repo';

const pkPrefix = 'SUBSCRIPTION';
const skPrefix = 'CONNECTION';

@Service()
export class WSConnectionService {
  constructor(
    @Inject(DI_LOGGER) private readonly logger: LambdaLogger,
    private readonly gqlSubscriptionRepo: GQLSubscriptionRepository,
  ) {}

  async register(event: WSConnection): Promise<WSConnection> {
    await this.gqlSubscriptionRepo.create({
      pk: `${pkPrefix}|$connect`,
      sk: `${skPrefix}|${event.connection}`,
      ...event,
    });
    return event;
  }

  async hydrate(connectionId: string): Promise<WSConnection> {
    const conn = await this.gqlSubscriptionRepo.find(`${pkPrefix}|$connect`, `${skPrefix}|${connectionId}`);
    if (conn === null) {
      const msg = `Connection "${connectionId}" could not be found!`;
      this.logger.error(msg, { connectionId }, this.constructor.name);
      throw new Error(msg);
    }

    return {
      connection: conn.connection,
      endpoint: conn.endpoint,
    };
  }

  async broadcast(connection: WSConnection, payload: string | Buffer): Promise<void> {
    const managementApi = new ApiGatewayManagementApi({
      endpoint: connection.endpoint,
    });

    try {
      await managementApi.postToConnection({ ConnectionId: connection.connection, Data: payload }).promise();
    } catch (e) {
      // this is stale connection
      // remove it from DB
      if (e && e.statusCode === 410) {
        await this.deregister(connection.connection);
      } else {
        throw e;
      }
    }

    return;
  }

  async deregister(connectionId: string): Promise<void> {
    const connections = await this.gqlSubscriptionRepo.fetch(`${pkPrefix}|`, `${skPrefix}|${connectionId}`);
    const disconnects = connections.items.map(async connection =>
      this.gqlSubscriptionRepo.remove(connection.pk, connection.sk),
    );
    await Promise.all(disconnects);
  }
}
