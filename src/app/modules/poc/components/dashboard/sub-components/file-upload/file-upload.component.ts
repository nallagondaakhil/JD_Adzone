import { Component, OnInit } from '@angular/core';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { AppService } from 'src/app/modules/poc/services/app.service';
import { environment } from 'src/environments/environment';
import {NgxImageCompressService} from 'ngx-image-compress';
import { IndexedDBService } from 'src/app/modules/poc/services/indexed-db.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  apiUrl = environment.apiBaseUrl;
  result = '';
  uploader: FileUploader;
  // hasBaseDropZoneOver: boolean;
  // hasAnotherDropZoneOver: boolean;
  response: string;
  imgResultAfterCompress: string;
  compressImage = false;
  fileList: {success: boolean, loading: boolean, file: File}[] = [];

  constructor(private http: HttpClient, private indexedDBService: IndexedDBService, private imageCompress: NgxImageCompressService) {
    this.uploader = new FileUploader({
     //url: `${environment.apiBaseUrl}/upload/files`,
     url:`${this.apiUrl}/api/v1/upload/files`,
      disableMultipart: false,
      isHTML5: true,
      // formatDataFunctionIsAsync: true,
      // formatDataFunction: async (item: any) => {
      //   return new Promise( (resolve, reject) => {
      //     resolve({
      //       name: item._file.name,
      //       length: item._file.size,
      //       contentType: item._file.type,
      //       date: new Date()
      //     });
      //   });
      // }
    });

    // this.hasBaseDropZoneOver = false;
    // this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );

    this.uploader.onBeforeUploadItem = item => {
        item.withCredentials = true;
        if (item.isUploading) {

        }
      };

    this.uploader.onAfterAddingFile = item => {
      // if (item.file.type.includes('image') && this.uploader.queue.length) {
      //     this.compressImg(window.URL.createObjectURL(item._file)).then(() => {
      //       fetch(this.imgResultAfterCompress)
      //       .then(res => res.blob())
      //       .then(blob => {
      //         const file = new File([blob], item.file.name, {type: item.file.type});
      //         this.uploader.clearQueue();
      //         this.uploader.addToQueue([file]);
      //         this.uploader.uploadAll();
      //         this.uploader.clearQueue();
      //       })
      //     });
      //   }
    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders)  =>  {
      if (this.compressImage && item.file.type.includes('image')) {
        this.compressImg(window.URL.createObjectURL(item._file)).then(() => {
         const blob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
          this.swUpload(blob, item.file.name);
        });
      } else {
        item._file.arrayBuffer().then((arrayBuffer) => {
        const blob = new Blob([new Uint8Array(arrayBuffer)], {type: item.file.type });
        this.swUpload(blob, item.file.name);
      });
    }
    };
  }

  ngOnInit(): void {}

  compressImg(img: any) {
      return this.imageCompress.compressFile(img, 1, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;
      }
    );
  }

  swUpload(blob: Blob, name: string) {
    console.log('File upload failed');
    if (!navigator.onLine) {
      this.indexedDBService
      .addBlob(blob, name)
      .then(this.backgroundSync)
      .catch(console.log);
    }
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
    }

  backgroundSync(): void {
    console.log('initiate background sync');
    navigator.serviceWorker.ready
      .then((swRegistration) => {
        swRegistration.sync.register('post-data');
        console.log('background sync registered');
      })
      .catch(console.log);
  }

  onFileSelected(event: any): void {

    const files: File[] = event.target.files;
    for (const file of files) {
      this.fileList.push({
        file,
        loading: false,
        success: false
      });
    }
    event.target.value = '';
  }

  onUploadFile(item: {success: boolean, loading: boolean, file: File}) {
    const formData = new FormData();

    formData.append('uploadfile', item.file, item.file.name);
    formData.append('keyname', item.file.name);
    item.loading = true;
    this.http.post(`${this.apiUrl}/api/v1/filecontroller/uploadFile`, formData, {responseType: 'text'}).toPromise().then(res => {
      alert(JSON.stringify(res));
      item.loading = false;
      item.success = true;
    }).catch(e => {
      alert(JSON.stringify(e));
      item.loading = false;
      item.success = false;
      if (this.compressImage && item.file.type.includes('image')) {
        this.compressImg(window.URL.createObjectURL(item.file)).then(() => {
          const blob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
          this.swUpload(blob, item.file.name);
        });
      } else {
        item.file.arrayBuffer().then((arrayBuffer) => {
          const blob = new Blob([new Uint8Array(arrayBuffer)], {type: item.file.type });
          this.swUpload(blob, item.file.name);
        });
      }
    });
  }

  onRemoveFile(item: {success: boolean, loading: boolean, file: File}) {
    let indx = this.fileList.indexOf(item);
    if (indx > -1) {
      this.fileList.splice(indx, 1);
    }
  }
}
