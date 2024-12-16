const DB_NAME = 'EzNoteManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export function saveFile(id, file) {
  return openDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id, file });

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  });
}

export function getFile(id) {
  return openDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME]);
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = (event) => resolve(event.target.result ? event.target.result.file : null);
      request.onerror = (event) => reject(event.target.error);
    });
  });
}

export function deleteFile(id) {
  return openDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  });
}
