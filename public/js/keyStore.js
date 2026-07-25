const DB_NAME = "e2ee";
const STORE = "keys";

export async function savePrivateKey(key) {
  const request = indexedDB.open(DB_NAME, 1);

  request.onupgradeneeded = (event) => {
    event.target.result.createObjectStore(STORE);
  };

  return new Promise((resolve) => {
    request.onsuccess = (event) => {
      const db = event.target.result;

      const tx = db.transaction(STORE, "readwrite");

      tx.objectStore(STORE).put(key, "private");

      tx.oncomplete = resolve;
    };
  });
}
