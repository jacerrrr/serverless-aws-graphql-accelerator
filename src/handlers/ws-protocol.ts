import { APIGatewayProxyResult } from 'aws-lambda';
// import { GRAPHQL_WS } from 'subscriptions-transport-ws';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';

const sendMessage = (status: number, type: string, id?: string, payload?: object): APIGatewayProxyResult => ({
  statusCode: status,
  // headers: { 'Sec-Websocket-Protocol': GRAPHQL_WS  },
  body: JSON.stringify({ id, payload, type }),
});

export const wsSendSuccess = (type: string, id?: string, payload?: object): APIGatewayProxyResult =>
  sendMessage(200, type, id, payload);
export const wsSendError = (payload: object, type = MessageTypes.GQL_ERROR, id?: string): APIGatewayProxyResult =>
  sendMessage(500, type, id, payload);
