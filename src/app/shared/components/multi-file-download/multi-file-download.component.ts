import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DownloadUtil } from '../../utils/download-util';

@Component({
  selector: 'jd-multi-file-download',
  templateUrl: './multi-file-download.component.html',
  styleUrls: ['./multi-file-download.component.scss']
})
export class MultiFileDownloadComponent implements OnInit {

  @Input() label = 'Download Documents';
  @Input() title: string = 'Download';
  @Input() type: string = 'outline-primary';
  @Input() disabled: boolean;
  @Input() files: {fileName: string, fileUrl: string}[];
  showDownloadModal: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  downloadFile(url: string, fileName: string) {
    url = DownloadUtil.getCommonFileDownloadUrl(url);
    DownloadUtil.downloadFile(this.http, url, fileName , 'file_download');
    // const mapForm = document.createElement('form');
    // mapForm.target = '_self' || '_blank';
    // mapForm.id = 'stmtForm';
    // mapForm.method = 'POST';
    // mapForm.action = url;

    // const mapInput = document.createElement('input');
    // mapInput.type = 'hidden';
    // mapInput.name = 'Data';
    // mapForm.appendChild(mapInput);
    // document.body.appendChild(mapForm);
    // mapForm.submit();
}

  downloadClick() {
    this.showDownloadModal = true;
  }

  onClose() {
    this.showDownloadModal = false;
  }

}
