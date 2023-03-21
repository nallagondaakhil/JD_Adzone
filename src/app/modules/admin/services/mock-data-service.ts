import { Injectable } from "@angular/core";
// import Db from "./db.json";

@Injectable()
export class MockDataService {
    constructor() {}

    async get(path: string, filter?: {column: string, val: any}): Promise<any> {
        return new Promise(resolve => {
            setTimeout(() => {
                if (filter) {
                    // const items = (Db as any)[path].data;
                    // const result = items && items.find((x: any) => x[filter.column] == filter.val);
                    // resolve(result);
                } else {
                    // resolve((Db as any)[path]);
                }
            }, 300);
        });
    }
}
