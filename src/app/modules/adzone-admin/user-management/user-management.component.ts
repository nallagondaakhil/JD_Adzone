import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings, SelectOptions } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { MasterDataService } from '../../admin/services/master-data.service';
import { MockDataService } from '../../showcase/mock-data.service';
import { VendormanagementService } from '../services/vendormanagement.service';
import { VendorManagement } from "../models/vendor-management.model";
import { ApiResponse } from '../../admin/models/paged-data.model';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/core/services/user.service';
import { RolePermissionService } from '../services/role-permission.service';
import { UsermanagementService } from '../services/usermanagement.service';
import { RoleService } from '../services/role-management.service';
import { UserManagementModelMapper, UserManagementView } from './models/user-management-view.model';
@Component({
  selector: 'jd-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  showAddModal = false;
  showUserAccess = false;
  dataTableModel: DataTableModel;
  ExecelFilterBody: DataLoadParams ;
  showUploadModal = false;
  ExecelSerchBody = {};
  selectedModel: UserManagementView;
  @ViewChild('dataTable') dataTable: DataTableComponent;
  showImport = false;
  searchClicked =false;
  dtOptions: DataTableModel={} as any;
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
  permissionView:any;
  permissionAdd:any;
  permissionEdit:any;
  permissionActivate:any;
  permissionDeactivate:any;
  permissionDelete:any;
  permissionUpload:any;
  permissionDownload:any;
  permissionSearch:any;
  permissionBulkUpload:any;
  actionItem:any = [];
  showTableData =  false;
  user = this.userService.getUserRoleId();
  constructor(private cdr: ChangeDetectorRef ,    
    private modalService: ModalDialogService,
    private masterDataService: MasterDataService,
    private alertService: AlertsService,
    private mockData: MockDataService,
    private userservicemangement: VendormanagementService,
    private userService:UserService,
    private userServiceMangement:UsermanagementService,
    private rolepermission:RolePermissionService,
    private roleService:RoleService,
    private http: HttpClient,) { }

    ngOnInit(): void {
      
      this.checkPermission().then(x => {
        this.initDataTable();
      });
     
    }

    async checkPermission(){
      await this.rolepermission.getPermissionForModule(this.user,"Vendor Management");
      this.permissionView = await this.rolepermission.getRoleById("view_vendor");
      console.log(this.permissionView);
      this.permissionAdd = await this.rolepermission.getRoleById("create_vendor");
      this.permissionEdit = await this.rolepermission.getRoleById("edit_vendor");
      this.permissionActivate = await this.rolepermission.getRoleById("activate_vendor");
      this.permissionDeactivate = await this.rolepermission.getRoleById("deactivate_vendor");
      this.permissionBulkUpload = await this.rolepermission.getRoleById("bulk upload_vendor");
      this.permissionDelete = await this.rolepermission.getRoleById("delete_vendor");
    }
     
    getMasterData(filter:string){
      let options: SelectOptions[] = [];
      switch(filter){
        case 'regions':
          this.userservicemangement.getRegion().then(regions=>{
            regions.forEach(region=>{
              options.push(region);
            });
          });
          break;
          case 'roles':
            this.roleService.getRole().then(roleIds=>{
              roleIds.forEach(role=>{
                options.push(role);
              });
            });
            break;
      }
      return options;
    }

  async initDataTable() {
    if(this.permissionEdit)
    {
      this.actionItem.push( {
        label: 'Action',
        clickableClass: 'dt-edit-menu',
        icon: '<span class="uxf-icon dt-edit-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
        click: (rawData: any) => {
          this.showAddModal = true;
          this.selectedModel = rawData;
        },
        
      });
    }
    if(this.permissionDelete)
   {
    this.actionItem.push({
      label: this.permissionEdit ?'':'Action',
      clickableClass: 'dt-delete-menu',
      icon: '<span class="uxf-icon dt-delete-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
      click: (rawData: any) => {
        this.onDeleteAction(rawData)
      },
    });
  }
    this.dataTableModel = {
      options: {
        processing: true,
        serverSide: true,
        showFilter: false,
        exportExcel: false,
        hideSearchBar: true,
        fixedColumnsTo: 2,
        fixedColumnsLast:1,
        searchPlaceHolder:'Search For Vendor Name, Vendor Code, RACF ID',
        filters:[
          {
            field: 'roleIds',
            type: 'roles',
            placeholder: 'Role',
            selectOptions: this.getMasterData('roles')
          },
          {
            field: 'regions',
            type: 'region',
            placeholder: 'Region',
            selectOptions: this.getMasterData('regions')
          },
          {
            field: 'subRegions',
            type: 'sub-region',
            placeholder: 'Sub-Region',
            //selectOptions: this.getMasterData('subregions')
          },
          {
            field: 'divisions',
            type: 'division',
            placeholder: 'Division',
            //selectOptions: this.getMasterData('divisions')
          },
          {
            field: 'markets',
            type: 'market',
            placeholder: 'Market',
            //selectOptions: this.getMasterData('countries')
          }, 
          {
            field: 'dateRange',
            type: 'dateRange',
            placeholder: 'Created Date Range',
            maxDate: new Date()
          },
          
        //  {
        //     field: 'dateRangeEffective',
        //     type: 'dateRange',
        //     placeholder: 'Effective Date'
        //   },
          {
            field: 'activateFlag',
            type: 'status',
          },    
        ],
        columns: [
          {
            title: 'RACF ID',
            data: 'racfId',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Username',
            data: 'userName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Email ID',
            data: 'emailId',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },

          // {
          //   title: 'Contact number',
          //   data: 'phoneNumber',
          //   render: (data: any, type: any, full: any) => {
          //     if (data) {
          //       return  `<span title= "${data}"> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          //   orderable: false,
          // },
          
          {
            title: 'Role',
            data: 'roleId',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return  `<span title= ${data[0].name}> ${data[0].name}  </span>`
              }
              return '';
            },
            orderable: false,
          },
          {
            title: 'Region',
            data: 'regionResponseDto',
            render: (data: any, type: any, full: any) => {
              if (data && data[0]) {
                if (data?.length > 1) {
                  var tooltip= data.map((x:any)=> x?.name);
                  return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                }
                return data[0]?.name || '-';
              }
              return '-';
            },
            orderable: false,
            // sortData: 'createdDate'
         
          },
          {
            title: 'Sub Region',
            data: 'subRegionResponseDto',
            render: (data: any, type: any, full: any) => {
              if (data && data[0]) {
                if (data?.length > 1) {
                  var tooltip= data.map((x:any)=> x?.name);
                  return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                }
                return data[0]?.name || '-';
              }
              return '-';
            },
            orderable: false,
            // sortData: 'createdDate'
         
          },
          {
            title: 'Division',
            data: 'divisionResponseDto',
            render: (data: any, type: any, full: any) => {
              if (data && data[0]) {
                if (data?.length > 1) {
                  var tooltip= data.map((x:any)=> x?.name);
                  return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                }
                return data[0]?.name || '-';
              }
              return '-';
            },
            orderable: false,
          }, {
            title: 'Market',
            data: 'marketResponseDto',
            render: (data: any, type: any, full: any) => {
              // console.log(data);
              if (data && data[0]) {
                if (data?.length > 1) {
                  var tooltip= data.map((x:any)=> x?.name);
                  //console.log(tooltip)
                  return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                }
                return data[0]?.name || '-';
              }
              return '-';
            },
            orderable: false,
            // sortData: 'createdDate'
         
          },
           {
            title: 'Dealership',
            data: 'dealerResponseDto',
            className: 'test',
            render: (data: any, type: any, full: any) => {
              
              if (data && data[0]) {
                if (data?.length > 1) {
                  var tooltip= data.map((x:any)=> x?.name);
                  
                  return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                }
                return data[0]?.name || '-';
              }
              return '-';
            },
            orderable: false,
            // sortData: 'createdDate'
         
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
            orderable: true,
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
            sortData: 'created_date',
          },
          {
            title: 'Updated By',
            data: 'updatedBy',
            render: (data: any, type: any, full: any) => {
              if (data ) {
        
                return  `<span title= ${data}> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
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
        // actionMenuItems: [],
        
        actionMenuItems: 
          this.actionItem,
        exportClicked: () => {
          // this.locationsManagemntService.initiateExportExcel(this.ExecelSerchBody,this.ExecelFilterBody).then((res: any) => {
          //   if (ApiErrorUtil.isError(res) || !res.message?.messageDescription) {
          //     this.alertService.show(ApiErrorUtil.errorMessage(res) || 'Failed to export data', AlertType.Critical);
          //   } else {
          //     this.alertService.show(res.message?.messageDescription);
          //   }
          // });
        },
        showSerialNo: true
      },
      // onRawClick: (rawData: any) => {
      //   // this.selectedModel = rawData;
      //   this.showEditDoc = true;
      // },
      loadData: async (params: DataLoadParams, settings) => {
        try {
          let requestBody: any = {};
          if(params.filters != undefined){
            params.filters.forEach((value, field)=>{
              if(field === 'activateFlag'){
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
          const res = await this.userServiceMangement
          // .getAllData(params,requestBody);
          .getAllUser(params,requestBody);
          if (!res || !res.data || !res.data.content) {
           // if (!res || !res.data) {
            return {
              totalRecords: 0,
              data: [],
            };
          }
          const viewModels = await Promise.all(res.data?.content.map((x: any) => UserManagementModelMapper.mapToViewModel(x,null)));
          //const viewModels = res.data;
         
          return {
            totalRecords: res.data.totalElements || 0,
            //totalRecords: res.totalRecords || 0,
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
      this.dataTableModel.options.columns.push({
        title: 'Status', 
        data: 'activateFlag',
        render: (data: any, type: any, full: any) => {
          
          if(data === "Active")
          return `<span class="active-change" title="`+data+`"><svg focusable="false" aria-hidden="true" fill="#367c2b" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></span>`
          else
          return `<span class="active-change" title="`+data+`"><svg focusable="false" aria-hidden="true" fill="#c21020" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>`
        },
        onClick: (rawData: any) => {
          if(rawData.activateFlag === "Active"){
            this.showConfirmation('Inactive', rawData);
          }else if(rawData.activateFlag === "Inactive"){
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
    const url = this.userservicemangement.getTemplateDownloadUrl();
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    DownloadUtil.downloadFile(this.http, url, 'vendorreport.xlsx' , 'vendor-management',this.ExecelSerchBody,this.ExecelFilterBody);
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

  showConfirmation(status: string, model: UserManagementView) {
    this.modalService.show({
      title: status === 'Active' ? 'Activate Vendor' : 'Deactivate Vendor',
      message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this Vendor?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
        try {
          let result: ApiResponse<UserManagementView>;
          if (status === 'Active') {
            result = await this.userservicemangement.activate(model.userId);
          } else {
            result = await this.userservicemangement.deactivate(model.userId);
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
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Vendor', AlertType.Critical);
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

  onDeleteAction(model: UserManagementView) {
    this.modalService.show({
      title: 'Delete User',
      message: `Are you sure you want to delete this Vendor?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
      try {
        let result: ApiResponse<UserManagementView>;
          result = await this.userservicemangement.delete(model.userId);
        if (ApiErrorUtil.isError(result)) {
          this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
        } else {
          this.alertService.show(result?.message?.messageDescription );
        }
      } catch (error) {
          this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete Vendor', AlertType.Critical);
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

  addVendorManage() {
    
    this.showAddModal = true;
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
    console.log('event',e)
    console.log('redrawbefore',this.dataTable)
    this.showAddModal = false;
    this.dataTable.redrawGrid();
    console.log('redrawafter')

  }
  bulkUpload() {
    this.showUploadModal = true;
  }
  onCloseUploadModal(e: any) {
    this.showUploadModal = false;
    this.dataTable.redrawGrid();
  }

}
