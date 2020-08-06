import { OperationMessagePayload } from 'subscriptions-transport-ws';

export interface GQLSubscription extends OperationMessagePayload {
  event: string;
  connection: string;
  operationId: string;
  query: string;
  variables: { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  operationName: string;
}
