export class WSUtil {
  static parseWSEntity(target: string): string {
    const idx = target.lastIndexOf('|');
    if (idx === -1) {
      return target;
    }
    return target.substring(idx + 1, target.length);
  }
}
