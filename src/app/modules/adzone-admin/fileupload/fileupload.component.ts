import { Component, OnInit } from '@angular/core';
import { FileuploadService } from './fileupload.service';
import { HttpClient } from '@angular/common/http';

import { Observable } from "rxjs";
import { switchMap, map, tap } from "rxjs/operators";
@Component({
  selector: 'jd-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {
  selectedFiles!: FileList;

  constructor(private uploadService: FileuploadService, private http: HttpClient,) { }

  ngOnInit(): void {

  }
  thumbnailUrlImage() {
    let imageUrl = "https://d12pa13fi2j4jh.cloudfront.net/adzone/jpg-5mb_2022-08-16_155125748_2022-08-16_155311.163.JPEG";;
    console.log('thumbnailUrlImage', imageUrl)
    this.download(imageUrl);
  }
  s3bucketImage() {
    let imageUrl = "https://s3.cn-northwest-1.amazonaws.com.cn/aws-channel-dss-r1-india-spm-qual-apsouth1-vpn-system/adzone/jpg-5mb_2022-08-16_155125.748.jpg";;
    console.log('s3bucketImage', imageUrl)
    this.download(imageUrl);
  }
  downloadImage() {
    let imageUrl = "https://d12pa13fi2j4jh.cloudfront.net/adzone/jpg-5mb_2022-08-16_155125.748.jpg";;
    console.log('downloadImage', imageUrl)
    this.download(imageUrl);
  }
  download(img) {
    const imgUrl = img;
    const imgName = imgUrl.substr(imgUrl.lastIndexOf("/") + 1);
    this.http
      .get(imgUrl, { responseType: "blob" as "json" })
      .subscribe((res: any) => {
        const file = new Blob([res], { type: res.type });

        // IE
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //   window.navigator.msSaveOrOpenBlob(file);
        //   return;
        // }

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = blob;
        link.download = imgName;

        // Version link.click() to work at firefox
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
          })
        );

        setTimeout(() => {
          // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }
  upload() {
    const file = this.selectedFiles.item(0);
    this.uploadService.uploadFile(file);
    }
    
    selectFile(event) {
    this.selectedFiles = event.target.files;
    }

}
