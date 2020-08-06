import { ClientConfiguration, DocumentClient } from 'aws-sdk/clients/dynamodb';
import Container from 'typedi';

import { environment } from '@environment';

export class DynamoDBClient {
  private static client: DocumentClient;

  static getInstance(): DocumentClient {
    if (DynamoDBClient.client == null) {
      let options: ClientConfiguration = {};
      if (environment.env === 'local') {
        options = {
          region: 'localhost',
          endpoint: 'http://localhost:7222',
        };
      }
      DynamoDBClient.client = new DocumentClient(options);
    }

    return DynamoDBClient.client;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DynamoDB(): (object: Record<string, any>, propertyName: string, index?: number) => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(object: Record<string, any>, propertyName: string, index?: number): void {
    Container.registerHandler({ object, propertyName, index, value: () => DynamoDBClient.getInstance() });
  };
}
