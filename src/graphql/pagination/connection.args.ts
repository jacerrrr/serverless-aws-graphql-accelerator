import { Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ConnectionArgs {
  @Field(() => Int)
  @Min(1)
  first: number;

  @Field({ nullable: true })
  after?: string;
}
