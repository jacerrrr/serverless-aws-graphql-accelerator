import { APIGatewayProxyResult } from 'aws-lambda';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';

const sendMessage = (status: number, type: string, id?: string, payload?: object): APIGatewayProxyResult => ({
  statusCode: status,
  // headers: { 'Sec-Websocket-Protocol': GRAPHQL_WS  },
  body: JSON.stringify({ id, payload, type }),
});

export class HandlerHelper {
  static wsSendError(payload: object, type = MessageTypes.GQL_ERROR, id?: string): APIGatewayProxyResult {
    return sendMessage(500, type, id, payload);
  }

  static wsSendSuccess(type: string, id?: string, payload?: object): APIGatewayProxyResult {
    return sendMessage(200, type, id, payload);
  }
}
