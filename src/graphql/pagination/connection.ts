import { ClassType, Field, Int, ObjectType } from 'type-graphql';

import { Page } from './page.model';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Connection = <T>(name: string, nodeType: ClassType<T>) => {
  @ObjectType(`${name}Edge`, { isAbstract: true })
  abstract class Edge {
    @Field(() => nodeType)
    node!: T;

    @Field({ description: 'Used in `before` and `after` args' })
    cursor!: string;
  }

  @ObjectType(`${name}Connection`, { isAbstract: true })
  abstract class ConnectionClass {
    @Field(() => Int)
    total!: number;

    @Field(() => [Edge])
    edges!: Array<Edge>;

    @Field(() => Page)
    pageInfo!: Page;
  }

  return ConnectionClass;
};
