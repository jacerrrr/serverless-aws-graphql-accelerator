import { Field, ID, InterfaceType } from 'type-graphql';

@InterfaceType('GQLObject')
export abstract class GQLObject {
  @Field(() => ID)
  uid: string;
}
