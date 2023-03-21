import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = 'https://jdapi-dev.heptagon.tech';
  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    const headers= new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*');
    headers.append('Accept', '*/*');

   // formData.append('file', file);
   formData.append('uploadfile', file,file.name);
   formData.append('keyname', file.name);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload/files`, formData, {
      headers:headers,
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}