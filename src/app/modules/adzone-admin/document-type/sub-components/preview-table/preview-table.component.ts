import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataLoadParams } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService,ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DocumentTypeService } from '../../../services/doc-type.service';
import { DocTypeModelMapper } from '../../models/doc-type-view.model';

@Component({
  selector: 'jd-preview-table',
  templateUrl: './preview-table.component.html',
  styleUrls: ['./preview-table.component.scss']
})
export class PreviewTableComponent implements OnInit {
  @Input() documentValues: any;
  @Input() deleteFile: boolean = false;
  // @Output() previewData = new EventEmitter();
  // config = { id: 'test', itemsPerPage: 4, currentPage: 1, totalItems: 10 }
  // params: DataLoadParams = { page: 1, size: 4, };

  constructor(private http: HttpClient,
    private service: DocumentTypeService,
    private alertService: AlertsService,
    private modalService: ModalDialogService,
    ) { }

  dataList: any;
  imgsData: any;
  uploadPopup = true;
  showTableData = false;
  loading = false;
  listImageSelect: any;
  showFlag: boolean = false;
  listModel: any;
  userAccess:any;
  deleteAccess:boolean = true;
  async ngOnInit(): Promise<void> {
    this.userAccess = localStorage.getItem('USERACCESSINFO');
    if(this.userAccess == 'Sub Region Admin'){
      this.deleteAccess = false;
    }
    this.loading = true;
    this.dataList = await this.service.getList(null, this.documentValues.documentId, this.documentValues.createdBy);
    this.imgsData = this.dataList.data;
    // console.log(this.imgsData)
    if (this.imgsData.length > 0) {
      this.listModel = await Promise.all(this.imgsData.map((x: any) => DocTypeModelMapper.mapToViewModel(x, null)));
      console.log(this.listModel)
      this.loading = false;
    }
    else {
      this.loading = false;
      this.alertService.show("No Files", AlertType.Critical);
    }
  }


  showLightbox(data: any) {
    // console.log(data)
    this.listImageSelect = [this.listModel.find(x => x.fileId == data.fileId)];
    // console.log(this.listImageSelect)
    if (String(this.listImageSelect[0].fileType).toLowerCase() != 'pdf') {
      this.showFlag = true;
    } else {
      window.open('master/pdf-view-full/' + this.listImageSelect[0].documentId + '/' + this.listImageSelect[0].fileId, '_blank');
    }
  }

  closeEventHandler() {
    this.showFlag = false;
  }

  deleteItems(file:any) {
    // const indx = this.listModel.indexOf(file);
    // // console.log("index",indx)
    // this.listModel.splice(indx, 1);
    // if(this.deleteFile){
    //   this.service.deleteFile(file.fileId)
    //   this.alertService.show("Document Deleted Successfully", AlertType.Success);
    // }

    this.modalService.show({
      title: 'Delete Document',
      message: `Are you sure you want to delete this Document?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
      try {
        const indx = this.listModel.indexOf(file);
        this.listModel.splice(indx, 1);
        if(this.deleteFile){
          // console.log("file details",file,file.fileId);
          this.service.deleteFile(file.fileId)
          this.alertService.show("Document Deleted Successfully", AlertType.Success);
        }else {
          this.alertService.show("Failed to delete Document",AlertType.Critical);
        }
      } catch (error) {
          this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete Document', AlertType.Critical);
      }
      this.loading = false;
      this.modalService.publisher.next(null);
      },
      cancelText: 'No',
      cancelCallback: () => {
        this.modalService.publisher.next(null);
      },
      modalType: ModalType.warning,
      isSecondModal: true
    });
  }

  onSubmit() {
    this.uploadPopup = false;
    this.showTableData = true;
    // this.previewData.emit();
  }

  // async pageChanged(event: any) {
  //   this.loading = true;
  //   this.params.page = event;
  //   this.config.currentPage = event;
  //   console.log(this.config.currentPage)
  //   const res = await this.service.getList(null,this.documentValues.documentId, this.documentValues.createdBy);
  //   if (!res || !res.data) {

  //   }
  //   else {
  //     this.config.totalItems = res.data.totalElements;
  //     console.log(this.config.totalItems)
  //     this.dataList = await Promise.all(res?.data?.map((x: any) => x));
  //     this.loading = false;
  //   }
  // }

}
