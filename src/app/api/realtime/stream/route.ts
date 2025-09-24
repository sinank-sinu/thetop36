import { NextRequest } from 'next/server';
import { addClient } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let isClosed = false;
      
      const send = (data: string) => {
        try {
          if (!isClosed) {
            controller.enqueue(encoder.encode(data));
          }
        } catch (error) {
          console.error('Error sending SSE data:', error);
          isClosed = true;
        }
      };

      const close = () => {
        try {
          if (!isClosed) {
            isClosed = true;
            controller.close();
          }
        } catch (error) {
          console.error('Error closing SSE stream:', error);
        }
      };

      // Initial comment to open stream
      send(': connected\n\n');
      
      const cleanup = addClient((data) => {
        if (!isClosed) {
          send(data);
        }
      });
      
      const interval = setInterval(() => {
        if (!isClosed) {
          send(`: ping ${Date.now()}\n\n`);
        } else {
          clearInterval(interval);
        }
      }, 30000);

      // Handle client disconnect
      const handleDisconnect = () => {
        isClosed = true;
        clearInterval(interval);
        cleanup();
        close();
      };

      // Return cleanup function
      return handleDisconnect;
    },
    cancel() {
      // Handle stream cancellation
      console.log('SSE stream cancelled');
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
