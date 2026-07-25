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

export function getPrivateKey() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                1
            );

        request.onsuccess =
            event => {

                const db =
                    event.target.result;

                const tx =
                    db.transaction(
                        STORE,
                        "readonly"
                    );

                const getRequest =
                    tx.objectStore(STORE)
                        .get("private");

                getRequest.onsuccess =
                    () => {

                        resolve(
                            getRequest.result
                        );

                    };

                getRequest.onerror =
                    () => {

                        reject(
                            getRequest.error
                        );

                    };

            };

        request.onerror =
            () => {

                reject(
                    request.error
                );

            };

    });

}