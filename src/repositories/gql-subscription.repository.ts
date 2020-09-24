import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Inject, Service } from 'typedi';

import { DI_ENVIRONMENT, DI_LOGGER } from '@ioc';
import { LambdaLogger } from '@core';
import { DynamoDB, GQLSubscriptionKeySchema, GQLSubscriptionSchema, PageSchema } from '@db';
import { Environment } from '@environment';

import { DYNAMO_TABLE_WS_SUBSCRIPTION } from './constants';
import { DynamoDBRepository } from './dynamodb.repository';

@Service()
export class GQLSubscriptionRepository extends DynamoDBRepository {
  constructor(
    @Inject(DI_ENVIRONMENT) env: Environment,
    @Inject(DI_LOGGER) logger: LambdaLogger,
    @DynamoDB() client: DocumentClient,
  ) {
    super(logger, client, `${env.application}-${env.environment}.${DYNAMO_TABLE_WS_SUBSCRIPTION}`);
  }

  /**
   * Creates a a single graphql subscription record
   * @param item The subscription to create
   */
  async create(item: GQLSubscriptionSchema): Promise<GQLSubscriptionSchema> {
    return this.put(item);
  }

  /**
   * Finds a graphql subscription record
   * @param pk The primary key of the graphql subscription
   * @param sk The sort key of the graphql subscription
   */
  async find(pk: string, sk: string): Promise<GQLSubscriptionSchema | null> {
    return this.get({ pk, sk });
  }

  /**
   * Fetches all graphql subscriptions for a given primary key and option sort key
   * @param pk The primary key of the graphql subscription to fetch
   * @param sk The sort key of the graphql subscription (if any)
   */
  async fetch(pk: string, sk?: string): Promise<PageSchema<GQLSubscriptionSchema, GQLSubscriptionKeySchema>> {
    let keyCondition = '#sk = :sk and begins_with(#pk, :pk)';
    let expressionAttrNames: { [key: string]: string } = { '#pk': 'pk', '#sk': 'sk' };
    let expressionAttrValues: { [key: string]: string | undefined } = { ':pk': pk, ':sk': sk };
    let index: string | undefined = 'reverse';
    if (!sk) {
      keyCondition = '#pk = :pk';
      expressionAttrNames = { '#pk': 'pk' };
      expressionAttrValues = { ':pk': pk };
      index = undefined;
    }
    return this.query(keyCondition, expressionAttrNames, expressionAttrValues, undefined, index);
  }

  /**
   * Removes a graphql subscription
   * @param pk The primary key of the subscription
   * @param sk The secondary key of the subscription
   */
  async remove(pk: string, sk: string): Promise<void> {
    return this.delete({ pk, sk });
  }
}
