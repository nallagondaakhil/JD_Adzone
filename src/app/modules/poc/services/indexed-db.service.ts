import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: IDBPDatabase<Blob>;
  constructor() {
    this.connectToDb().then(x => {
      this.addConfigs();
    });
  }

  async connectToDb() {
    this.db = await openDB<Blob>('local-db', 1, {
      upgrade(db) {
        db.createObjectStore('blob-store', {
          keyPath: 'id',
          autoIncrement: true
        });
        db.createObjectStore('configs');
      },
    });
  }

  addConfigs() {
    this.db.put('configs', JSON.stringify(environment), 'appconfig');
  }

  addBlob(blob: Blob, name: string) {
    return this.db.put('blob-store', {blob, filename: name});
  }

}

