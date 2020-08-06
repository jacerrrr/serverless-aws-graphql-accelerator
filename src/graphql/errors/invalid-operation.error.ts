import { ProtocolError } from './protocol.error';

export class InvalidOperationError extends ProtocolError {
  constructor(reason?: string) {
    super(reason ? `Invalid operation: ${reason}` : 'Invalid operation');
  }
}
