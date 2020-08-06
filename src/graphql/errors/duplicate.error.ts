import { ApolloError } from 'apollo-server-core';

export class DuplicateObjectError extends ApolloError {
  constructor(message: string) {
    super(message, 'DUPLICATE');
  }
}
