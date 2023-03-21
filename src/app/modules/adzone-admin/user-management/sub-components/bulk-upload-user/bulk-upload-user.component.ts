import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { UploadFilesService } from 'src/app/shared/services/upload-files.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { FileUtil } from 'src/app/shared/utils/file-util';
import { UsermanagementService } from '../../../services/usermanagement.service';

@Component({
  selector: 'jd-bulk-upload-user',
  templateUrl: './bulk-upload-user.component.html',
  styleUrls: ['./bulk-upload-user.component.scss']
})
export class BulkUploadUserComponent implements OnInit {

  @Output() closed: EventEmitter<boolean> = new EventEmitter<boolean>();
  loading = false;
  progress = 0;
  maxSize = 3; // 3 MB
  selectedFile: {file: File, name: string, size: string, status: 'uploading'|'new'|'failed'|'completed', progress: number};
  constructor(private service: UsermanagementService, private alertService: AlertsService, private http: HttpClient) { }

  ngOnInit() {
  }

  upload() {
    if (!this.selectedFile) { 
      this.alertService.show('File is required',AlertType.Critical);
      return; }
    this.selectedFile.status = 'uploading';
    this.loading = true;
    this.service.bulkUpload(this.selectedFile.file).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.selectedFile.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type == HttpEventType.Response) {
          console.log(event.body);
          if (ApiErrorUtil.isError(event.body)) {
            this.alertService.show(ApiErrorUtil.errorMessage(event.body));
            this.selectedFile.status = 'failed';
          } else {
            const filename: string = 'userbulkupload.xlsx';
            const binaryData = [];
            binaryData.push(event.body);
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            this.alertService.show(event.body.message?.messageDescription || 'File uploaded successfully.User upload progress started. you will see the uploaded file with status in download section once the process is completed.');
            this.selectedFile.status = 'completed';
            this.onClose();
          }
          this.loading = false;
        }
      },
      (err: any) => {
        this.alertService.show('Failed to upload file', AlertType.Critical);
        this.loading = false;
        this.selectedFile.status = 'failed';
      });
  }
  onClose() {
    this.closed.emit();
  }

  onFileChange(e: any) {
    if (this.loading) { return; }
    const file = e.target.files[0];
    const extension = FileUtil.getExtension(file.name);
    if (!(extension === 'xls' || extension === 'xlsx')) {
      this.selectedFile = null;
      e.target.value = '';
      this.alertService.show('Please select valid file.', AlertType.Critical);
      return;
    }
    if (file.size > (3 * 1024 * 1024)) {
      this.selectedFile = null;
      e.target.value = '';
      this.alertService.show(`File is too large, maximum allowed file size is ${this.maxSize} MB`, AlertType.Critical);
      return;
    }
    this.selectedFile = {
      file,
      name: file.name,
      size: (file.size / 1024).toFixed() + 'kb',
      status: 'uploading',
      progress: 0
    };
    e.target.value = '';
    //this.upload();
  }

  downloadTemplate() {
    const url = this.service.getbulkTemplateDownloadUrl();
    DownloadUtil.downloadFile(this.http, url, 'userbulkuploadtemplate.xlsx' , 'user_bulk_upload');
  }

  downloadFile(url: string) {
      const mapForm = document.createElement('form');
      mapForm.target = '_self' || '_blank';
      mapForm.id = 'stmtForm';
      mapForm.method = 'POST';
      mapForm.action = url;

      const mapInput = document.createElement('input');
      mapInput.type = 'hidden';
      mapInput.name = 'Data';
      mapForm.appendChild(mapInput);
      document.body.appendChild(mapForm);
      mapForm.submit();
  }
}

