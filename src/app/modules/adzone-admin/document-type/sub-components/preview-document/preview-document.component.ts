import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataLoadParams } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { DocumentTypeService } from '../../../services/doc-type.service';
import { DocTypeModelMapper, DocumentTypeView } from '../../models/doc-type-view.model';
@Component({
  selector: 'jd-preview-document',
  templateUrl: './preview-document.component.html',
  styleUrls: ['./preview-document.component.scss']
})
export class PreviewDocumentComponent implements OnInit {
  @Input() documentId: any;
  @Output() previewData = new EventEmitter<any>();

  config = { id: 'test', itemsPerPage: 4, currentPage: 1, totalItems: 10 }
  params: DataLoadParams = { page: 1, size: 4, };
  requestBody: any;

  constructor(private http: HttpClient,
    private alertService: AlertsService,
    private service: DocumentTypeService,
    private router: Router) { }

  loading = false;
  showTableData = false;
  preview_page = true;
  imgList: any;
  newArr: any;
  multipleArray: any;
  selectedValues: any;
  
  page = 1;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.imgList = await this.service.getPreviewImages(this.params, this.documentId);
    if (this.imgList && this.imgList.data && this.imgList.data.content) {
      this.config.totalItems = this.imgList.data.totalElements;
      this.newArr = await Promise.all(this.imgList?.data?.content.map((x: any) => x));
      this.multipleArray = await Promise.all(this.imgList?.data?.content.map((a: any) => a.multipleThumbnailResponseDto));
      this.loading = false;
      // console.log(this.newArr)
    }
    else if (this.imgList.data == null) {
      this.loading = false;
    }
  }

  isSelected(data: any, checked: any, dataArray: any) {
    dataArray.forEach((x: any) => {
      x.checked = false;
    })
    data.checked = checked.currentTarget.checked;
  }

  updatedList: any;
  submitImgs() {
    let finalValues = [];
    this.multipleArray.forEach((x: any) => {
      let filterValue = x.find(y => y.checked == true);
      if (filterValue) {
        finalValues.push(filterValue)
      }
    });
    this.selectedValues = finalValues.map((x: any) => ({
      documentFileId: x.documentFileId,
      thumbailDocumentId: x.thumbailDocumentId,
      documentId: this.documentId
    }))
    console.log(this.selectedValues)
    if (this.selectedValues) {
      this.updatedList = this.service.updatePreviewImages(this.params, this.selectedValues);
      this.alertService.show("Thumbnail Image is updated successfully");
      this.previewData.emit();
      this.preview_page = false;
      // this.showTableData = true;
      
    } else {
      this.preview_page = true;
      this.alertService.show("Select Properly", AlertType.Critical);
    }
  }

  async pageChanged(event: any) {
    this.loading = true;
    this.params.page = event;
    this.config.currentPage = event;
    console.log(this.config.currentPage)
    const res = await this.service.getPreviewImages(this.params, this.documentId);
    if (!res || !res.data || !res.data.content) {

    }
    else {
      this.config.totalItems = res.data.totalElements;
      console.log(this.config.totalItems)
      this.imgList = await Promise.all(res?.data?.content.map((x: any) => x));
      this.newArr = this.imgList;
      this.multipleArray = await Promise.all(res?.data?.content.map((a: any) => a.multipleThumbnailResponseDto));
      this.loading = false;
    }
  }
}