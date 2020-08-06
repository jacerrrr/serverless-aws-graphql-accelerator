export interface WSConnection {
  connection: string;
  endpoint: string;
}

export interface WSEvent {
  event: string;
  payload: object;
}
