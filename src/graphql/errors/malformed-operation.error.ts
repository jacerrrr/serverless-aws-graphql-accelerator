import { ProtocolError } from './protocol.error';

export class MalformedOperationError extends ProtocolError {
  constructor(reason?: string) {
    super(reason ? `Malformed operation: ${reason}` : 'Malformed operation');
  }
}
