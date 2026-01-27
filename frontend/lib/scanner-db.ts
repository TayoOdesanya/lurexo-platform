import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define our database schema
interface ScannerDB extends DBSchema {
  tickets: {
    key: string;
    value: {
      ticketId: string;
      eventId: string;
      holderName: string;
      holderEmail: string;
      ticketTier: string;
      isCheckedIn: boolean;
      checkedInAt: string | null;
      qrCode: string;
    };
  };
  scans: {
    key: number;
    value: {
      id?: number;
      ticketId: string;
      eventId: string;
      scannedAt: string;
      scannerId: string;
      synced: boolean;
      valid: boolean;
      reason?: string;
    };
    indexes: { 
      'by-synced': boolean;
      'by-event': string;
    };
  };
  events: {
    key: string;
    value: {
      eventId: string;
      eventName: string;
      eventDate: string;
      venue: string;
      totalTickets: number;
      checkedInCount: number;
      lastSynced: string;
    };
  };
}

let dbInstance: IDBPDatabase<ScannerDB> | null = null;

export async function initScannerDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<ScannerDB>('lurexo-scanner', 1, {
    upgrade(db) {
      // Tickets store
      if (!db.objectStoreNames.contains('tickets')) {
        db.createObjectStore('tickets', { keyPath: 'ticketId' });
      }

      // Scans store with indexes
      if (!db.objectStoreNames.contains('scans')) {
        const scanStore = db.createObjectStore('scans', {
          keyPath: 'id',
          autoIncrement: true,
        });
        scanStore.createIndex('by-synced', 'synced');
        scanStore.createIndex('by-event', 'eventId');
      }

      // Events store
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'eventId' });
      }
    },
  });

  return dbInstance;
}

// Store tickets for an event (called once when scanner opens)
export async function storeEventTickets(
  eventId: string,
  tickets: Array<{
    ticketId: string;
    holderName: string;
    holderEmail: string;
    ticketTier: string;
    isCheckedIn: boolean;
    checkedInAt: string | null;
    qrCode: string;
  }>
) {
  const db = await initScannerDB();
  const tx = db.transaction('tickets', 'readwrite');

  await Promise.all(
    tickets.map((ticket) =>
      tx.store.put({
        ...ticket,
        eventId,
      })
    )
  );

  await tx.done;
}

// Get ticket from local storage
export async function getTicketFromDB(ticketId: string) {
  const db = await initScannerDB();
  return await db.get('tickets', ticketId);
}

// Record a scan (offline-capable)
export async function recordScan(scan: {
  ticketId: string;
  eventId: string;
  scannerId: string;
  valid: boolean;
  reason?: string;
}) {
  const db = await initScannerDB();
  await db.add('scans', {
    ...scan,
    scannedAt: new Date().toISOString(),
    synced: false,
  });
}

// Update ticket check-in status locally
export async function updateTicketCheckIn(
  ticketId: string,
  checkedIn: boolean
) {
  const db = await initScannerDB();
  const ticket = await db.get('tickets', ticketId);
  
  if (ticket) {
    await db.put('tickets', {
      ...ticket,
      isCheckedIn: checkedIn,
      checkedInAt: checkedIn ? new Date().toISOString() : null,
    });
  }
}

// Get all unsynced scans
export async function getUnsyncedScans() {
  const db = await initScannerDB();
  const index = db.transaction('scans').store.index('by-synced');
  return await index.getAll(false as any);
}

// Mark scans as synced
export async function markScansAsSynced(scanIds: number[]) {
  const db = await initScannerDB();
  const tx = db.transaction('scans', 'readwrite');

  await Promise.all(
    scanIds.map(async (id) => {
      const scan = await tx.store.get(id);
      if (scan) {
        await tx.store.put({ ...scan, synced: true });
      }
    })
  );

  await tx.done;
}

// Get scan history for an event
export async function getScanHistory(eventId: string, limit: number = 50) {
  const db = await initScannerDB();
  const index = db.transaction('scans').store.index('by-event');
  const scans = await index.getAll(eventId as any);
  
  // Return most recent first
  return scans.sort((a, b) => 
    new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
  ).slice(0, limit);
}

// Store event metadata
export async function storeEventMetadata(event: {
  eventId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  totalTickets: number;
}) {
  const db = await initScannerDB();
  await db.put('events', {
    ...event,
    checkedInCount: 0,
    lastSynced: new Date().toISOString(),
  });
}

// Get event metadata
export async function getEventMetadata(eventId: string) {
  const db = await initScannerDB();
  return await db.get('events', eventId);
}

// Update checked-in count
export async function updateCheckedInCount(eventId: string, count: number) {
  const db = await initScannerDB();
  const event = await db.get('events', eventId);
  
  if (event) {
    await db.put('events', {
      ...event,
      checkedInCount: count,
    });
  }
}

// Clear all data for an event (cleanup after event)
export async function clearEventData(eventId: string) {
  const db = await initScannerDB();
  
  // Delete tickets
  const ticketsTx = db.transaction('tickets', 'readwrite');
  const tickets = await ticketsTx.store.getAll();
  await Promise.all(
    tickets
      .filter((t) => t.eventId === eventId)
      .map((t) => ticketsTx.store.delete(t.ticketId))
  );
  await ticketsTx.done;

 // Delete scans
const scansTx = db.transaction('scans', 'readwrite');
const scans = await scansTx.store.index('by-event').getAll(eventId as any);
await Promise.all(
  scans.map((s) => s.id && scansTx.store.delete(s.id))
);
await scansTx.done;

  // Delete event
  await db.delete('events', eventId);
}