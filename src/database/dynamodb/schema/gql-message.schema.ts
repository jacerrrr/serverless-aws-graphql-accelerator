export interface GQLMessageSchema {
  channelId: string;
  createdDate: string;
  message: string;
  messageType: string;
  authorUid: string;
  recipientUid?: string;
}
