/* ── IndexedDB Utility ────────────────────────────────────────── */

const DB_NAME = "GitVisionDB";
const DB_VERSION = 1;
const STORE_NAMES = ["sessions", "replays", "settings", "progress"];

export async function openDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("IndexedDB is not available in server environment"),
    );
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      STORE_NAMES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbGet<T>(
  store: string,
  key: string,
): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, "readonly");
    const storeObj = transaction.objectStore(store);
    const request = storeObj.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbSet<T extends { id: string }>(
  store: string,
  value: T,
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, "readwrite");
    const storeObj = transaction.objectStore(store);
    const request = storeObj.put(value);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function dbGetAll<T>(store: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, "readonly");
    const storeObj = transaction.objectStore(store);
    const request = storeObj.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

export async function dbDelete(store: string, key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, "readwrite");
    const storeObj = transaction.objectStore(store);
    const request = storeObj.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function dbClear(store: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, "readwrite");
    const storeObj = transaction.objectStore(store);
    const request = storeObj.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
