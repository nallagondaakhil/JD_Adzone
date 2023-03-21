import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DocumentTypeService } from '../../../services/doc-type.service';
import { DocumentTypeView } from '../../models/doc-type-view.model';

@Component({
  selector: 'jd-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  uploadedDocs: {fileName: string, fileUrl: string, fileId?:number}[];
  thumbnailDocs: {fileName: string, fileUrl: string, fileId?:string}[];
  docFn: any;
  docthumb: any;
  isNotFile = false;
  isNotFile1 = true;
  
  isEdit = false;
  thumbnailFile: {fileName?: string, fileUrl?: string, fileId?:string}[];
  uploadedFile: {fileName?: string, fileUrl?: string, fileId?:number}[];
  @Input() model: DocumentTypeView;
  @ViewChild('documentTypeUpload', { static: false }) form: NgForm;
  fileUplodExtention = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png','mp4'];
  constructor(
    private docService: DocumentTypeService,
  ) { 
    this.docFn = this.docService.uploadFiles.bind(this.docService);
    this.docthumb = this.docService.uploadthumbFiles.bind(this.docService);
  }

  ngOnInit(): void {
    this.isEdit = this.model ? true : false;
    this.model = this.model || {} as any;
    this.initializeData().then(x => { });
  }
  async initializeData() {
    if(this.isEdit){
      this.uploadedFile = this.model.uploadedDocs || null;
      this.uploadedFile? this.isNotFile = true : this.isNotFile = false;
      this.thumbnailFile = this.model.thumbnailDocs || null;
      this.thumbnailFile? this.isNotFile1 = false : this.isNotFile1 = true;
    }else{
      this.isNotFile = false;
      this.isNotFile1 = false;
    }
  }
  onUpload(files: {fileName: string, fileUrl: string}[]) {
    files = files || [];
    this.model.uploadedDocs = files;
    if (this.model.uploadedDocs.length > 0) {
      this.isNotFile = false;
    }
    console.log(this.model)
  }
  onthumbUpload(files: {fileName: string, fileUrl: string}[]) {
    files = files || [];
    this.model.thumbnailDocs = files;
    if (this.model.thumbnailDocs.length > 0) {
      this.isNotFile1 = false;
    }
    console.log(this.model)
  }
}

