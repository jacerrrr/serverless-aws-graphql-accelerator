import { ExecutionResult, GraphQLSchema, parse, specifiedRules, subscribe as gqlSubscribe, validate } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { OperationMessage } from 'subscriptions-transport-ws';
import { PubSubEngine } from 'type-graphql';

import { GQLSubscriptionContext } from './context';
import { MalformedOperationError } from './errors';

export const subscribe = async (
  schema: GraphQLSchema,
  operation: OperationMessage,
  connection: string,
  registerSubscriptions = false,
  pubSub: PubSubEngine = new PubSub(),
): Promise<AsyncIterableIterator<ExecutionResult> | ExecutionResult> => {
  if (operation.payload == null) {
    throw new MalformedOperationError('Property "payload" is missing');
  }
  if (operation.id == null) {
    throw new MalformedOperationError('Property "id" is missing.');
  }
  const document = parse(operation.payload.query as string);
  const gqlErrors = validate(schema, document, specifiedRules);
  if (gqlErrors.length > 0) {
    return { errors: gqlErrors };
  }
  const context: GQLSubscriptionContext = {
    $$internal: {
      connection,
      registerSubscriptions,
      operation,
      pubSub,
    },
  };
  return gqlSubscribe({
    document,
    schema,
    contextValue: context,
    operationName: operation.payload.operationName,
    variableValues: operation.payload.variables,
  });
};
