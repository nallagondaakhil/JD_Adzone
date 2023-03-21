import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HttpUtil } from "./http.util";

export class DownloadUtil {
    private static getFileName(response: HttpResponse<Blob>) {
        let filename: string;
        try {
          const contentDisposition: string = response.headers.get('content-disposition');
          const r = /(?:filename=")(.+)(?:")/;
          filename = r.exec(contentDisposition)[1];
        }
        catch (e) {
          filename = '';
        }
        return filename;
    }

    static downloadFile(http: HttpClient, url: string, fileName: string, slug: string ,options: any= "" ,  requestBody: any = "", method:any = "") {
        console.log(requestBody,options);
      const headers = new HttpHeaders({slug});
        if(method == "get"){
          http.get(url, { observe: 'response', responseType: 'blob' as 'json' , headers }).subscribe(
            (response: any) => {
              const filename: string = this.getFileName(response) || fileName;
              const binaryData = [];
              binaryData.push(response.body);
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
              downloadLink.setAttribute('download', filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
          }
          )
        }else{
          console.log(requestBody,options);
          http.post(url,requestBody||{}, { params: HttpUtil.convertReqOptionToParams(options),observe: 'response', responseType: 'blob' as 'json' , headers }).subscribe(
          
            (response: any) => {
                const filename: string = this.getFileName(response) || fileName;
                const binaryData = [];
                binaryData.push(response.body);
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
                downloadLink.setAttribute('download', filename);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            )
        };
    }

    static getCommonFileDownloadUrl(fileName: string) {
      if (!fileName) { return ''; }
      if (fileName.startsWith('http://') || fileName.startsWith('https://')) { return fileName; }
      return `${environment.apiBaseUrl}/api/v1/downloadController/downloads/${fileName}`;
    }
}
