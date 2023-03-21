import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { MasterDataService } from '../../admin/services/master-data.service';
import { MockDataService } from '../../showcase/mock-data.service';
import { DocumentCategoryService } from '../services/doc-cat.service';
import { DocCategoryModelMapper, DocumentCategoryView } from './models/doc-cat-view.model';
import { RolePermissionService } from '../services/role-permission.service';


@Component({
  selector: 'jd-document-category',
  templateUrl: './document-category.component.html',
  styleUrls: ['./document-category.component.scss']
})
export class DocumentCategoryComponent implements OnInit {

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
  selectedModel: DocumentCategoryView;
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
    // private masterDataService: MasterDataService,
    private alertService: AlertsService,
    private mockData: MockDataService,
    private docService: DocumentCategoryService,
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
    await this.rolepermission.getPermissionForModule(this.user,"Document Category");
    this.permissionView = await this.rolepermission.getRoleById("view_dc");
    this.permissionAdd = await this.rolepermission.getRoleById("create_dc");
    this.permissionEdit = await this.rolepermission.getRoleById("edit_dc");
    this.permissionActivate = await this.rolepermission.getRoleById("activate_dc");
    this.permissionDeactivate = await this.rolepermission.getRoleById("deactivate_dc");
    this.permissionDelete = await this.rolepermission.getRoleById("delete_dc");
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

            this.selectedModel = rawData;
            this.showEditDoc = true;
           
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
          }
        )
      }
    this.dataTableModel = {
      options: {
        processing: true,
        serverSide: true,
        showFilter: false,
        exportExcel: false,
        hideSearchBar: true,
        searchPlaceHolder:'Search For Document Category',
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
          // {
          //   title: 'Category ID',
          //   data: 'documentCategoryId',
          //   render: (data: any, type: any, full: any) => {
          //     if (data ) {
        
          //       return  `<span title= "${data}"> ${data}  </span>`
          //     }
          //     return '';
          //   },
          //   orderable: true,
          // },
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
            sortData: 'documentCategoryName',
          },
          {
            title: 'Created By',
            data: 'createdBy',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
            sortData: 'created_by',
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
            //sortData: 'updatedBy',
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
            sortData: 'updated_date'
         
          },
         
        ],
        responsive: false,
        showActionMenu: true,
        showEditIcon:false,
        showDeleteIcon: false,
        // actionMenuItems: [],
        actionMenuItems: 
          this.actionItem,
        exportClicked: () => {
          this.docService.initiateExportExcel(this.ExecelSerchBody,this.ExecelFilterBody,this.racfId).then((res: any) => {
            if (ApiErrorUtil.isError(res) || !res.message?.messageDescription) {
              this.alertService.show(ApiErrorUtil.errorMessage(res) || 'Failed to export data', AlertType.Critical);
            } else {
              this.alertService.show(res.message?.messageDescription);
            }
          });
        },
        showSerialNo: true
      },
      loadData: async (params: DataLoadParams, settings) => {
        try {
          let requestBody: any = {};
          if(params.filters != undefined){
            params.filters.forEach((value, field)=>{
              if(field === 'activeFlag'){
                requestBody[field] = value;
              }
              else if(value?.length && field !== 'dateRange'){
                requestBody[field] = value;
              }else if(field === 'dateRange' && value?.length){
                requestBody['fromDate'] = value[0];
                requestBody['toDate'] = value[1];
              }
            });
          }
          this.ExecelFilterBody = requestBody;
          this.ExecelSerchBody = params ;
          console.log(this.ExecelFilterBody,this.ExecelSerchBody)
          delete params.filters;
          this.excelBody = {...params, ...requestBody}
          const res = await this.docService
          .getAll(params,requestBody);
          if (!res || !res.data || !res.data.content) {
            return {
              totalRecords: 0,
              data: [],
            };
          }
          const viewModels = await Promise.all(res.data?.content.map((x: any) => DocCategoryModelMapper.mapToViewModel(x,null)));
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
    const url = this.docService.getTemplateDownloadUrl(this.racfId);
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    DownloadUtil.downloadFile(this.http, url, 'document_category_report.xlsx' , 'doc_cat',this.ExecelSerchBody,this.ExecelFilterBody);
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
  showConfirmation(status: string, model: DocumentCategoryView) {
    this.modalService.show({
      title: status === 'Active' ? 'Activate Document Category' : 'Deactivate Document Category',
      message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this Document Category?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
        try {
          let result: ApiResponse<DocumentCategoryView>;
          if (status === 'Active') {
            result = await this.docService.activate(model.documentCategoryId);
          } else {
            result = await this.docService.deactivate(model.documentCategoryId);
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
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Document Category', AlertType.Critical);
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
  onDeleteAction(model: DocumentCategoryView) {
      this.modalService.show({
        title: 'Delete Document Category',
        message: `Are you sure you want to delete this Document Category?`,
        okText: 'Yes',
        okCallback: async () => {
          this.loading = true;
        try {
          let result: ApiResponse<DocumentCategoryView>;
            result = await this.docService.delete(model.documentCategoryId);
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.alertService.show(result?.message?.messageDescription );
          }
        } catch (error) {
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete Document Category', AlertType.Critical);
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
    this.selectedModel = null;
    this.showEditDoc = true;
    
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
