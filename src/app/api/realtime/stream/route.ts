import { NextRequest } from 'next/server';
import { addClient } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: string) => controller.enqueue(encoder.encode(data));
      // Initial comment to open stream
      send(': connected\n\n');
      const cleanup = addClient((data) => send(data));
      const interval = setInterval(() => send(`: ping ${Date.now()}\n\n`), 30000);
      return () => {
        clearInterval(interval);
        cleanup();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
