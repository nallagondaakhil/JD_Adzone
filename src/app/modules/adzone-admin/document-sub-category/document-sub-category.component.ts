import { formatDate, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService , AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { MasterDataService } from '../../admin/services/master-data.service';
import { SubCatMaster } from '../models/sub-cat-master.model';
import { SubCatService } from '../services/sub-cat.service';
import { SubCatView ,SubCatMasterModelMapper } from './models/sub-cat-view.model';
import { ConditionalExpr } from '@angular/compiler';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/core/services/user.service';
import { RolePermissionService } from '../services/role-permission.service';
@Component({
  selector: 'jd-document-sub-category',
  templateUrl: './document-sub-category.component.html',
  styleUrls: ['./document-sub-category.component.scss']
})
export class DocumentSubCategoryComponent implements OnInit {

  showAddModal = false;
  iscompanyEdit = false;
  dataTableModel: DataTableModel;
  showUploadModal = false;
  ExecelFilterBody: DataLoadParams ;
  ExecelSerchBody = {};
  
  @ViewChild('dataTable') dataTable: DataTableComponent;
  showImport = false;
  searchClicked =false;
  dtOptions: DataTableModel;
 
  @ViewChild('filterButton') filterButton: ElementRef;
  
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('txtSearch') txtSearch: ElementRef;
  showFilterDialog = false;
  filterDialogTop = 0;
  filterDialogRight = 0;
  filterDialogWidth = 0;
  filterApplied: boolean = false;
  filters: FilterSettings[];
  loading = false;
  excelBody: any = {};
  showEditDoc = false;
  racfId:any;
  selectedModel: SubCatView;
  permissionView:any;
  permissionAdd:any;
  permissionEdit:any;
  permissionActivate:any;
  permissionDeactivate:any;
  permissionDelete:any;
  permissionUpload:any;
  permissionDownload:any;
  permissionSearch:any;
  actionItem:any = [];
  showTableData =  false;
  user = this.userService.getUserRoleId();
  constructor(
    private cdr: ChangeDetectorRef ,    
    private modalService: ModalDialogService,
    private masterDataService: MasterDataService,
    private alertService: AlertsService,
    private docsubcatservice:SubCatService,
    private titlecasePipe:TitleCasePipe,
    private http: HttpClient,
    private userService:UserService,
    private rolepermission:RolePermissionService,
  ) { }

  ngOnInit(): void {
    this.checkPermission().then(x => {
      this.initDataTable();
    });
    this.racfId = this.userService.getRacfId();
  }
  async checkPermission(){
    await this.rolepermission.getPermissionForModule(this.user,"Document Sub Category");
    this.permissionView = await this.rolepermission.getRoleById("view_dsc");
    this.permissionAdd = await this.rolepermission.getRoleById("create_dsc");
    this.permissionEdit = await this.rolepermission.getRoleById("edit_dsc");
    this.permissionActivate = await this.rolepermission.getRoleById("activate_dsc");
    this.permissionDeactivate = await this.rolepermission.getRoleById("deactivate_dsc");
    this.permissionDelete = await this.rolepermission.getRoleById("delete_dsc");
  }

  initDataTable() {
    if(this.permissionEdit)
    {
      this.actionItem.push(
        {
          label: 'Action',
          clickableClass: 'dt-edit-menu',
          icon: '<span class="uxf-icon dt-edit-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
          click: (rawData: any) => {
            this.showEditDoc = true;
            this.selectedModel = rawData;
          },
        })
      }
      if(this.permissionDelete)
      {
        this.actionItem.push(
          {
            label: this.permissionEdit ?'':'Action',
            clickableClass: 'dt-delete-menu',
            icon: '<span class="uxf-icon dt-delete-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
            click: (rawData: any) => {
              this.onDeleteAction(rawData)
            },
          })
        }
    this.dataTableModel = {
      options: {
        processing: true,
        serverSide: true,
        showFilter: false,
        exportExcel: false,
        hideSearchBar: true,
        fixedColumnsTo: 2,
        searchPlaceHolder:'Search For Category,Sub-Category',
        filters:[
          {
            field: 'dateRange',
            type: 'dateRange',
            placeholder: 'Created Date Range',
            maxDate: new Date()
          },
          {
            field: 'activeFlag',
            type: 'status',
          },    
        ],
        columns: [
          {
            title: 'Category Name',
            data: 'documentCategoryName',
            render: (data: any, type: any, full: any) => {
              
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
            sortData: 'documentCategoryName'
          },
          {
            title: 'Sub-Category Name',
            data: 'documentSubCategoryName',
            render: (data: any, type: any, full: any) => {
              if (data) {
        
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
            sortData: 'documentSubCategoryName',
          },
          {
            title: 'Category 2',
            data: 'documentSubChildCategory',
            render: (data: any, type: any, full: any) => {
              if (data && data[0]) {
                data[0].name= this.titlecasePipe.transform(data[0].documentSubChildCategoryName)
                if (data.length > 1) {
                  var tooltip= data.map((x:any)=> x.documentSubChildCategoryName);
                  return `${data[0].name} <span title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data.length - 1}</span>`;
                }
                return data[0].name || '-';
              }
              return '-';
            },
            orderable: false
          },
          {
            title: 'Category 3',
            data: 'childFourthCategoryId',
            render: (data: any, type: any, full: any) => {
              if (data && data[0]) {
                data[0].name= this.titlecasePipe.transform(data[0].documentSubChildFourthCategoryName)
                if (data.length > 1) {
                  var tooltip= data.map((x:any)=> x.documentSubChildFourthCategoryName);
                  return `${data[0].name} <span title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data.length - 1}</span>`;
                }
                return data[0].name || '-';
              }
              return '-';
            },
            orderable: false
          },
          
          {
            title: 'Created By',
            data: 'createdBy',
            render: (data: any, type: any, full: any) => {
              if (data ) {
        
                return  `<span title= ${data}> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
            //sortData: 'createdDate'
          },
          {
            title: 'Created Date',
            data: 'createdDate',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return `${formatDate(data, 'dd-MM-yyyy h:mm:ss a', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: true,
            sortData: 'createdDate',
          },
          {
            title: 'Updated By',
            data: 'updatedBy',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
            sortData: 'updatedBy',
          },
          {
            title: 'Last Updated',
            data: 'updatedDate',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return `${formatDate(data, 'dd-MM-yyyy h:mm:ss a', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: false,
             //sortData: 'createdDate'
         
          },
         
        ],
        responsive: false,
        showActionMenu: true,
        showEditIcon:false,
        showDeleteIcon: false,
        actionMenuItems: 
         this.actionItem,
        exportClicked: () => {
          this.docsubcatservice.initiateExportExcel(this.ExecelSerchBody,this.ExecelFilterBody,this.racfId).then((res: any) => {
            if (ApiErrorUtil.isError(res) || !res.message?.messageDescription) {
              this.alertService.show(ApiErrorUtil.errorMessage(res) || 'Failed to export data', AlertType.Critical);
            } else {
              this.alertService.show(res.message?.messageDescription);
            }
          });
        },
        showSerialNo: true
      },
      onRawClick: (rawData: any) => {
        // this.selectedModel = rawData;
        //this.showEditDoc = true;
      },
      loadData: async (params: DataLoadParams, settings) => {
        try {
          let requestBody: any = {};
          if(params.filters != undefined){
            params.filters.forEach((value, field)=>{
              if(field === 'activeFlag'){
                requestBody[field] = value;
              }
              
              else if(value?.length && field !== 'dateRange' && field !== 'dateRangeEffective'){
                requestBody[field] = value;
              }else if(field === 'dateRange' && value?.length){
                requestBody['fromDate'] = value[0];
                requestBody['toDate'] = value[1];
              }
              else if (field === 'dateRangeEffective' && value?.length) {
                if (value.length > 0) {
                  requestBody['effectiveFromDate'] = value[0];
                  requestBody['effectiveToDate'] = value[1];
                }
              }
            });
          }
          this.ExecelFilterBody = requestBody;
          this.ExecelSerchBody = params ;
          delete params.filters;
          this.excelBody = {...params, ...requestBody}
          const res = await this.docsubcatservice
          .getAll(params,requestBody);
          if (!res || !res.data || !res.data.content) {
            return {
              totalRecords: 0,
              data: [],
            };
          }

          const viewModels = await Promise.all(res.data?.content.map((x: any) => SubCatMasterModelMapper.mapToViewModel(x,this.docsubcatservice)));
          return {
            totalRecords: res.data.totalElements || 0,
            data: viewModels || [],
          };
        } catch (e) {
          return {
            totalRecords: 0,
            data: [],
          };
        }
      },
    };
    if(this.permissionActivate || this.permissionDeactivate)
    {
      this.dataTableModel.options.columns.push(
        {
          title: 'Status', 
          data: 'activeFlag',
          render: (data: any, type: any, full: any) => {
            if(data === "Active")
            return `<span class="active-change" title="`+data+`"><svg focusable="false" aria-hidden="true" fill="#367c2b" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></span>`
            else
            return `<span class="active-change" title="`+data+`"><svg focusable="false" aria-hidden="true" fill="#c21020" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>`
          },
          onClick: (rawData: any) => {
            if(rawData.activeFlag === "Active"){
              this.showConfirmation('Inactive', rawData);
            }else if(rawData.activeFlag === "Inactive"){
              this.showConfirmation('Active', rawData);
            }
          },
          orderable: false,
          clickableElementClas: 'active-change'
        })
    }
    if(this.permissionView){
      this.showTableData=true;
    }
  }
  downloadTemplate() {
    const url = this.docsubcatservice.getTemplateDownloadUrl(this.racfId);
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");

    DownloadUtil.downloadFile(this.http, url, 'document_subcategory_report.xlsx' , 'doc_sub_cat',this.ExecelSerchBody,this.ExecelFilterBody);
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
  showConfirmation(status: string, model: SubCatView) {
    this.modalService.show({
      title: status === 'Active' ? 'Activate Document Category' : 'Deactivate Document Category',
      message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this Document Sub-Category?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
        try {
          let result: ApiResponse<SubCatView>;
          if (status === 'Active') {
            result = await this.docsubcatservice.activate(model.documentSubCategoryId);
          } else {
            result = await this.docsubcatservice.deactivate(model.documentSubCategoryId);
          }
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            // if(result?.message?.messageDescription.length)
            this.alertService.show(result?.message?.messageDescription );
            // else
            // this.alertService.show("Status Updated Successfully");
          }
        } catch (error) {
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Document Sub-Category', AlertType.Critical);
        }
        this.loading = false;
        this.modalService.publisher.next(null);
        this.dataTable.redrawGrid();
      },
      cancelText: 'No',
      cancelCallback: () => {
        this.modalService.publisher.next(null);
      },
      modalType: ModalType.warning,
      isSecondModal: false
    });
  }
  onDeleteAction(model: SubCatView) {
    this.modalService.show({
      title: 'Delete Document Sub-Category',
      message: `Are you sure you want to delete this Document Sub-Category?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
      try {
        let result: ApiResponse<SubCatView>;
          result = await this.docsubcatservice.delete(model.documentSubCategoryId);
        if (ApiErrorUtil.isError(result)) {
          this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
        } else {
          this.alertService.show(result?.message?.messageDescription );
        }
      } catch (error) {
          this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete Document Sub-Category', AlertType.Critical);
      }
      this.loading = false;
      this.modalService.publisher.next(null);
      this.dataTable.redrawGrid();
      },
      cancelText: 'No',
      cancelCallback: () => {
        this.modalService.publisher.next(null);
      },
      modalType: ModalType.warning,
      isSecondModal: true
    });
}
  addDocCat() {
    this.showEditDoc = true;
    this.selectedModel = null;
  }

  onImportClick() {
    this.showImport = true;
  }

  onCloseImportModal() {
    this.showImport = false;
    
  }
  onSearchChange(val: string) {
    this.dataTable.onSearchChange(val)
  }

  onSearchClick(val: string) {
    this.dataTable.onSearchClick(val);
  }

  onClearSearch(val: string) {
    this.dataTable.onClearSearch(val);
    (this.txtSearch.nativeElement as HTMLInputElement).value = '';
  }

  onSearchKeyup(val: string){

  }

  onFilterClick(){
    this.filterDialogTop = (this.filterButton.nativeElement.offsetTop + this.filterButton.nativeElement.offsetHeight);
    let filterDialogOffsetRight = (this.filterButton.nativeElement.offsetLeft + this.filterButton.nativeElement.offsetWidth);
    this.filterDialogRight = window.innerWidth - filterDialogOffsetRight;
    this.filterDialogWidth = filterDialogOffsetRight - this.filterButton.nativeElement.offsetLeft;
    this.showFilterDialog = !this.showFilterDialog;
    this.cdr.detectChanges();
  }

  onCloseFilter(){
    this.showFilterDialog = false;
    this.dataTable.onCloseFilter();
    this.filterApplied = false;
  }

  onFilterCallback(options:FilterSettings[]){
    this.dataTable.onFilterCallback(options);
    this.showFilterDialog = !this.showFilterDialog;
  }

  onFilterUpdated(value: boolean){
    this.filterApplied = value;
  }
  onCloseAddModal(e:any){
    this.showEditDoc = false;
    this.dataTable.redrawGrid();
  }

}
