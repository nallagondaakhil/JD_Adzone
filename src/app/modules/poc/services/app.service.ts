import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AppService {

    constructor(private http: HttpClient) {

    }

    getData(): Promise<any> {
        return this.http.get('https://jsonplaceholder.typicode.com/users').toPromise();
    }

    testCall(apiUrl: string): Promise<any> {
        return this.http.get(apiUrl, {responseType: 'text'}).toPromise();
    }
}
