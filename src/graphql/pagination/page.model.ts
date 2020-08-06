import { Field, ObjectType } from 'type-graphql';

@ObjectType('Page', { description: 'Cursor pagination current page information' })
export class Page {
  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;

  @Field({ nullable: true })
  hasNextPage?: boolean;

  @Field({ nullable: true })
  hasPreviousPage?: boolean;
}
