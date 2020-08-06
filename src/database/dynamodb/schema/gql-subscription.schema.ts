export interface GQLSubscriptionKeySchema {
  pk: string;
  sk: string;
}

export interface GQLSubscriptionSchema extends GQLSubscriptionKeySchema {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
