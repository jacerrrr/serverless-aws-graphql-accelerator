import { ApolloError } from 'apollo-server-core';

export class ResourceNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
  }
}
