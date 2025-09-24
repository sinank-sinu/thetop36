type Client = {
  id: number;
  send: (data: string) => void;
  connectedAt: Date;
  lastPing: Date;
};

let clients: Client[] = [];
let counter = 0;

// Clean up inactive clients every 5 minutes
setInterval(() => {
  const now = new Date();
  const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
  
  clients = clients.filter(client => {
    const timeSinceLastPing = now.getTime() - client.lastPing.getTime();
    if (timeSinceLastPing > inactiveThreshold) {
      console.log(`Removing inactive client ${client.id}`);
      return false;
    }
    return true;
  });
}, 5 * 60 * 1000);

export function addClient(send: (data: string) => void): () => void {
  const id = ++counter;
  const now = new Date();
  const client: Client = { 
    id, 
    send, 
    connectedAt: now,
    lastPing: now
  };
  
  clients.push(client);
  console.log(`Client ${id} connected. Total clients: ${clients.length}`);
  
  return () => {
    clients = clients.filter((c) => c.id !== id);
    console.log(`Client ${id} disconnected. Total clients: ${clients.length}`);
  };
}

export function pingClient(clientId: number): void {
  const client = clients.find(c => c.id === clientId);
  if (client) {
    client.lastPing = new Date();
  }
}

export type BroadcastPayload = Record<string, unknown> | string | number | boolean | null;
export interface BroadcastMessage {
  type: string;
  payload: BroadcastPayload;
  ts: number;
  id?: string;
}

export function broadcast(type: string, payload: BroadcastPayload, id?: string): void {
  const message: BroadcastMessage = { 
    type, 
    payload, 
    ts: Date.now(),
    ...(id && { id })
  };
  
  let data: string;
  try {
    data = JSON.stringify(message);
  } catch (error) {
    console.error('Failed to serialize broadcast message:', error);
    return;
  }

  const sseData = `data: ${data}\n\n`;
  let successCount = 0;
  let errorCount = 0;
  const failedClients: number[] = [];

  // Send to all clients
  for (const client of clients) {
    try {
      client.send(sseData);
      successCount++;
    } catch (error) {
      errorCount++;
      failedClients.push(client.id);
      console.error(`Failed to send to client ${client.id}:`, error);
    }
  }

  // Remove failed clients
  if (failedClients.length > 0) {
    clients = clients.filter(client => !failedClients.includes(client.id));
    console.log(`Removed ${failedClients.length} failed clients`);
  }

  if (errorCount > 0) {
    console.log(`Broadcast to ${successCount} clients, ${errorCount} failed`);
  }
}

export function getClientCount(): number {
  return clients.length;
}

export function getClientStats(): { total: number; oldest: Date | null; newest: Date | null } {
  if (clients.length === 0) {
    return { total: 0, oldest: null, newest: null };
  }

  const connectedAtTimes = clients.map(c => c.connectedAt);
  return {
    total: clients.length,
    oldest: new Date(Math.min(...connectedAtTimes.map(d => d.getTime()))),
    newest: new Date(Math.max(...connectedAtTimes.map(d => d.getTime())))
  };
}
