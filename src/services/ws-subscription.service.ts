import { Service } from 'typedi';

import { GQLSubscription } from '@model';
import { GQLSubscriptionRepository } from '@repo';

const pkPrefix = 'SUBSCRIPTION';
const skPrefix = 'CONNECTION';

@Service()
export class WSSubscriptionService {
  constructor(private readonly gqlSubscriptionRepo: GQLSubscriptionRepository) {}

  async subscribe(subscription: GQLSubscription): Promise<GQLSubscription> {
    await this.gqlSubscriptionRepo.create({
      ...subscription,
      pk: `${pkPrefix}|${subscription.event}`,
      sk: `${skPrefix}|${subscription.connection}`,
    });
    return subscription;
  }

  async subscribersByEvent(event: string): Promise<Array<GQLSubscription>> {
    const subscribers = await this.gqlSubscriptionRepo.fetch(`${pkPrefix}|${event}`);
    return subscribers.items.map(s => ({
      event: s.event,
      connection: s.connection,
      operationId: s.operationId,
      query: s.query,
      variables: s.variables,
      operationName: s.operatationName,
    }));
  }

  async unsubscribe(operation: string, connection: string): Promise<void> {
    const subscriptions = await this.gqlSubscriptionRepo.fetch(`${pkPrefix}|${operation}`, `${skPrefix}|${connection}`);
    const unsubscribes$ = subscriptions.items.map(s => this.gqlSubscriptionRepo.remove(s.pk, s.sk));
    await Promise.all([unsubscribes$]);
  }
}
