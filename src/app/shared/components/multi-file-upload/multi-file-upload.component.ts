import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { param } from 'jquery';
import { Observable } from 'rxjs/internal/Observable';
import { BannerService } from 'src/app/modules/adzone-admin/services/banner.service';
import { DocumentTypeService } from 'src/app/modules/adzone-admin/services/doc-type.service';
import { AlertsService, AlertType } from '../../services/alerts.service';
import { IndependentcomponentserviceService } from '../../services/independentcomponentservice.service';
import { ApiErrorUtil } from '../../utils/api-error.util';
import { DownloadUtil } from '../../utils/download-util';
import { FileUtil } from '../../utils/file-util';


const extension = ['pdf', 'doc', 'xls', 'xlsx'];

@Component({
  selector: 'jd-multi-file-upload',
  templateUrl: './multi-file-upload.component.html',
  styleUrls: ['./multi-file-upload.component.scss']
})
export class MultiFileUploadComponent implements OnInit {

  @Input() multiple = true;
  @Input() label: string = 'Upload Document';
  @Input() buttonLabel: string = 'Attach Document';
  @Input() markAsRequired: boolean;
  @Input() files: {fileName: string, fileUrl: string, fileId?: number,bannerId:number}[];
  @Input() fileTypes: string[];
  @Input() maxSize = 5;
  @Input() uploadFunction: (file: File) => Observable<{fileName: string, fileUrl: string}>;
  @Input() uploadFunctionWithParam: (file: File,params:any) => Observable<{fileName: string, fileUrl: string,fileId:number}>;
  @Input() param:any;
  @Input() showDownload:boolean;
  @Output() onComplete = new EventEmitter<{fileName: string, fileUrl: string}[]>()
  @Input() showModal: boolean;
  @Input() onlyPopup: boolean = false;
  @Input() allowAllType: boolean = false;
  @Input() allowAllSize: boolean = false;
  @Input() deleteFile: boolean = false;
  @Input() deleteBanner: boolean = false;
  @Input() isBanner: boolean = false;
  processing = false;
  selectedFiles: FileModel[] = [];
  acceptTypes = '';
  displayStyle = "none";
  deletedFile:any[]=[];
  // errMsg = false;

  constructor(private alertService: AlertsService,
    private docService: DocumentTypeService,
    private http: HttpClient,
    private bannerService: BannerService,
    private intcompservice: IndependentcomponentserviceService,
    ) { }

  ngOnInit() {
    this.acceptTypes = (this.fileTypes || extension).map(x => `.${x}`).join(',');
    // console.log("test",this.files)
  }

  onSelectFiles(event: any): void {
    console.log("test1",this.files)
    console.log("test2",this.selectedFiles)
    const files = event.target.files;
    // todo validate file type .doc, .pdf
    this.validateAndUpload(files);
    event.target.value = '';
  }

  validateAndUpload(files: File[]) {
    for (const file of files) {
      if (file.size > (1024 * 1024 * this.maxSize) && !this.allowAllSize) {
        this.alertService.show(`File is too large, maximum allowed file size is ${this.maxSize} MB`, AlertType.Critical);
        continue;
      }
      const fileTypes = this.fileTypes || extension;
      if ((fileTypes.indexOf(FileUtil.getExtension(file.name)) < 0) && !this.allowAllType) {
        this.alertService.show(`File type Must be ${fileTypes.join(', ')}`, AlertType.Critical);
        continue;

      }
      this.selectedFiles.push(
        {
          name: file.name,
          file,
          uploadStatus: 'new',
          progress: 0,
          size: ((file.size) / 1024).toFixed() + 'KB'
        }
      );
    }
    this.uploadFiles();
  }

  onFileChange(pFileList: File[]) {
    this.validateAndUpload(pFileList);
  }

  onRemoveFile(file: FileModel) {
    console.log(file)
    if (file.uploadStatus === 'inprogress') {
      return;
    }
    const indx = this.selectedFiles.indexOf(file);
    this.selectedFiles.splice(indx, 1);
    console.log('selected',this.selectedFiles)
    if (this.deleteFile) {
      this.docService.deleteFile(file.fileId)
    } else if (this.deleteBanner) {
      this.bannerService.deleteFile(file.bannerId)
    }
  }

  onRemoveOldFile(file: any) {
    console.log(file)
    const indx = this.files.indexOf(file);
    this.files.splice(indx, 1);
    console.log('files',this.files)
    // let deletedFile:any[]= [];
    this.deletedFile.push(file)
 

    if (this.deleteFile) {
      this.docService.deleteFile(file.fileId)
    } else if (this.deleteBanner) {
      this.bannerService.deleteFile(file.bannerId)
    }
  }

  downloadDocument(file: any){
    const url = this.docService.downloadFile(file.fileName);
    DownloadUtil.downloadFile(this.http, url, file.fileName , 'img_download');
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

  async uploadFiles() {
    if (!this.selectedFiles.length) { return; }
    this.selectedFiles.forEach((x, index) => {
        if (x.uploadStatus !== 'new') {
          return;
        }
        x.uploadStatus = 'inprogress';
        // this.processing = true;
        // this.errMsg = true;
        this.displayStyle = "block";
        if(!JSON.stringify(this.param).length){
          this.uploadFunction(x.file).subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              x.progress = Math.round(100 * event.loaded / event.total);
            } else if (event.type == HttpEventType.Response) {
                if (event.body){
                x.uploadStatus = 'completed';
                x.url = event.body && event.body.fileUrl || undefined;
                x.localUrl = event.body && event.body.s3Url || undefined;
                x.progress = 100;
              } else {
                x.uploadStatus = 'failed';
              }
            }
          }, (err: any) => {
            x.uploadStatus = 'failed';
          });
        }else{
          this.uploadFunctionWithParam(x.file,this.param).subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.processing = true;
              // this.errMsg = true;
              x.progress = Math.round(100 * event.loaded / event.total);
            } else if (event.type == HttpEventType.Response) {
                if (event.body){
                x.uploadStatus = 'completed';
                this.processing = false;
                // this.errMsg = false;
                this.displayStyle = "none";
                x.url = event.body && event.body?.fileUrl || undefined;
                x.localUrl = event.body && event.body?.s3Url || undefined;
                x.fileId = event.body && event.body?.fileId || undefined;
                x.bannerId = event.body && event.body.data?.bannerId || undefined;
                x.progress = 100;
              } else {
                x.uploadStatus = 'failed';
              }
            }
          }, (err: any) => {
            x.uploadStatus = 'failed';
            this.processing = false;
            // this.errMsg = false;
          });
        }
    });
  }

  onClose() {
    let fileArray = [];
    fileArray = this.files?.length ? this.files.map(file => {return file}) : [];
    this.selectedFiles && this.selectedFiles.forEach(file => fileArray.push({fileName: file.name, fileUrl: file.url, localUrl: file.localUrl?.replace('blob:','')}))
    this.onComplete.emit(fileArray)
    this.showModal = false;
  }
  onCloseSave() {
    let fileArray = [];
    fileArray = this.files?.length ? this.files.map(file => {return file}) : [];
    this.selectedFiles && this.selectedFiles.forEach(file => fileArray.push({fileName: file.name, fileUrl: file.url, localUrl: file.localUrl?.replace('blob:','')}))
    this.onComplete.emit(fileArray)
    this.showModal = false;
    this.intcompservice.changeUpload(this.deletedFile)
  }

  openModal() {
    this.showModal = true;
  }

}

export interface FileModel {
  url?: string;
  name: string;
  file?: File;
  uploadStatus?: 'new' | 'completed' | 'inprogress' | 'failed';
  progress?: number;
  size?: string;
  localUrl?: string;
  fileId?:number;
  bannerId?:number;
}
