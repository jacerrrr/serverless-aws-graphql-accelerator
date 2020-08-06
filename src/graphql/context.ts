import { AuthResponseContext } from 'aws-lambda';
import { OperationMessage } from 'subscriptions-transport-ws';
import { PubSubEngine } from 'type-graphql';
import { ContainerInstance } from 'typedi';

/** GraphQL subscription server context */
export interface GQLSubscriptionContext {
  $$internal: {
    registerSubscriptions: boolean;
    connection: string;
    operation: OperationMessage;
    pubSub: PubSubEngine;
  };
}

/** GraphQL user context */
export interface UserContext extends AuthResponseContext {
  email: string;
}

/** GraphQL server context object  */
export interface GQLContext {
  requestId: number;
  container: ContainerInstance;
  // user: UserContext;
}
