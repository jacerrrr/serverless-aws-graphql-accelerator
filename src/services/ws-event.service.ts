import moment from 'moment';
import { Service } from 'typedi';

import { WSEvent } from '@model';
import { GQLSubscriptionRepository } from '@repo';

const pkPrefix = 'EVENT';
const skPrefix = 'SUBSCRIPTION';

@Service()
export class WSEventService {
  constructor(private readonly gqlSubscriptionRepo: GQLSubscriptionRepository) {}

  async publish(event: WSEvent): Promise<void> {
    const uq = moment().toISOString();
    await this.gqlSubscriptionRepo.create({
      pk: `${pkPrefix}|${uq}|${JSON.stringify(event.payload)}`,
      sk: `${skPrefix}|${event.event}`,
      event: event.event,
      payload: event.payload,
    });
  }

  async remove(eventKey: string, eventName: string): Promise<void> {
    await this.gqlSubscriptionRepo.remove(eventKey, eventName);
  }
}
