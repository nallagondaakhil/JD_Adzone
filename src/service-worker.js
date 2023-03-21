importScripts('./ngsw-worker.js');
// importScripts('./firebase-messaging-sw.js');
let config;

self.addEventListener('fetch', (event) => {
  console.log('started executing in background');
});

self.addEventListener('sync', (event) => {

  if (event.tag === 'post-data') {
    // call method
    event.waitUntil(getDataAndSend());
    console.log('started executing in background');
  }
});

function setConfig() {
  return readFromIndexDb('local-db', 'configs', 'appconfig').then(res => {
    config = JSON.parse(res);
    console.log(config);
  });
}

function uploadFile(data, db) {
  //indexDb
  const file = new File([data.blob], data.filename, { lastModified: new Date().getTime(), type: data.blob.type });
  var formData = new FormData()
  formData.append('uploadfile', file, data.filename);
  formData.append('keyname', data.filename);
  console.log('Execute file upload fetch');
  fetch(`${config.apiBaseUrl}/upload/files`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
    },
    body: formData,
  })
    .then(() => {
      Promise.resolve();
      console.log('File uploaded!');
      deleteData(db);
    })
    .catch(() => Promise.reject());
}

function getDataAndSend() {
  setConfig().then(() => {
    let db;
    const request = indexedDB.open('local-db');
    request.onerror = (event) => {
      console.log('Please allow app to use IndexedDB');
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      getData(db);
    };
  });  
}

function getData(db) {
  const transaction = db.transaction(['blob-store']);
  const objectStore = transaction.objectStore('blob-store');
  objectStore.getAll().onsuccess = function(event) {
    event.target.result.forEach((item, index, arr) => {
    const request = objectStore.get(item.id);
    request.onerror = (event) => {
      console.log('Unable to get data');
    };
    request.onsuccess = (event) => {
      console.log('read file from indexeddb');
      uploadFile(request.result, db);
      console.log('Blob data: ' + request.result);
    };
    })
  };
}

function deleteData(db) {
  const transaction = db.transaction(['blob-store'], "readwrite");
  const objectStore = transaction.objectStore('blob-store');
  objectStore.getAll().onsuccess = function(event) {
    event.target.result.forEach((item, index, arr) => {
      const request = objectStore.delete(item.id);
      request.onerror = (event) => {
        console.log('Unable to Delete file');
      };
      request.onsuccess = (event) => {
        console.log('Deleted the file');
      };
    })
  };
}

function readFromIndexDb(db, table, key) {
  return new Promise((resolve, reject) => {
    const dbrequest = indexedDB.open(db || 'local-db');
    dbrequest.onerror = (event) => {
      console.log('Please allow app to use IndexedDB');
      return reject();
    };
    dbrequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([table]);
      const objectStore = transaction.objectStore(table);
      const request = objectStore.get(key);
      request.onerror = (event) => {
        console.log('Unable to get data');
        return reject();
      };
      request.onsuccess = (event) => {
        console.log('read data from indexeddb');
        resolve(request.result);
        console.log('Received data: ' + request.result);
      };
    };
  });
}
