type Client = {
  id: number;
  send: (data: string) => void;
};

let clients: Client[] = [];
let counter = 0;

export function addClient(send: (data: string) => void): () => void {
  const id = ++counter;
  const client = { id, send };
  clients.push(client);
  return () => {
    clients = clients.filter((c) => c.id !== id);
  };
}

export type BroadcastPayload = Record<string, unknown> | string | number | boolean | null;
export interface BroadcastMessage {
  type: string;
  payload: BroadcastPayload;
  ts: number;
}

export function broadcast(type: string, payload: BroadcastPayload): void {
  const message: BroadcastMessage = { type, payload, ts: Date.now() };
  const data = JSON.stringify(message);
  for (const c of clients) {
    try {
      c.send(`data: ${data}\n\n`);
    } catch {}
  }
}
