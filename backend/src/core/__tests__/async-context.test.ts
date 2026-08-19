import { asyncContext, getRequestContext } from '../async-context';
import { randomUUID } from 'node:crypto';

describe('AsyncLocalStorage Context Isolation', () => {
  it('should isolate requestId between concurrent executions', async () => {
    const results: string[] = [];

    const mockRequest = async (id: string, delay: number) => {
      return new Promise<void>((resolve) => {
        asyncContext.run({ requestId: id, correlationId: 'corr-' + id }, () => {
          setTimeout(() => {
            const context = getRequestContext();
            if (context) {
              results.push(context.requestId);
            }
            resolve();
          }, delay);
        });
      });
    };

    const id1 = randomUUID();
    const id2 = randomUUID();
    const id3 = randomUUID();

    await Promise.all([
      mockRequest(id1, 30),
      mockRequest(id2, 10),
      mockRequest(id3, 20),
    ]);

    expect(results).toContain(id1);
    expect(results).toContain(id2);
    expect(results).toContain(id3);
    expect(results.length).toBe(3);
    // Since delays are 10, 20, 30, we expect id2 to finish first, then id3, then id1.
    expect(results[0]).toBe(id2);
    expect(results[1]).toBe(id3);
    expect(results[2]).toBe(id1);
  });
});