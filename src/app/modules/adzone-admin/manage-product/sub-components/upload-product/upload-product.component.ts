import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ManageProductService } from '../../../services/manage-product.service';
import { ManageProductView } from '../../models/manage-product-view.model';

@Component({
  selector: 'jd-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss']
})
export class UploadProductComponent implements OnInit {
  uploadedDocs: {fileName: string, fileUrl: string, fileId?:number}[];
  thumbnailDocs: {fileName: string, fileUrl: string, fileId?:string}[];
  docFn: any;
  docthumb: any;
  isNotFile = true;
  isNotFile1 = true;
  isEdit = false;
  thumbnailFile: {fileName?: string, fileUrl?: string, fileId?:string}[];
  uploadedFile: {fileName?: string, fileUrl?: string, fileId?:number}[];
  @Input() model: ManageProductView;
  @ViewChild('documentTypeUpload', { static: false }) form: NgForm;
  fileUplodExtention = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png','mp4'];
  constructor(private productService:ManageProductService) { 
    this.docFn = this.productService.uploadFiles.bind(this.productService);
    this.docthumb = this.productService.uploadthumbFiles.bind(this.productService);
  }

  ngOnInit(): void {
    this.isEdit = this.model ? true : false;
    this.model = this.model || {} as any;
    this.initializeData().then(x => { });
  }
  async initializeData() {
    if(this.isEdit){
      this.uploadedFile = this.model.uploadedDocs || null;
      this.uploadedFile? this.isNotFile = false : this.isNotFile = true;
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
  }
  onthumbUpload(files: {fileName: string, fileUrl: string}[]) {
    files = files || [];
    this.model.thumbnailDocs = files;
    if (this.model.thumbnailDocs.length > 0) {
      this.isNotFile1 = false;
    }
  }
}
