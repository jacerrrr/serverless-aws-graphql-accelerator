import { Field, ObjectType } from 'type-graphql';

import { GQLObject } from '@graphql/graphql.object';

@ObjectType('Hello', {
  description: 'An object representing a hello',
  implements: GQLObject,
})
export class Hello implements GQLObject {
  uid: string;

  @Field()
  name: string;
}
