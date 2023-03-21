import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings, SelectOptions } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { MasterDataService } from '../../admin/services/master-data.service';
import { DealerManagementService } from '../services/dealer-management.service';
import { RoleService } from '../services/role-management.service';
import { UsermanagementService } from '../services/usermanagement.service';
import { DealerManagementModelMapper, DealerManagementViewModel } from './models/dealer-management-view.model';
import { RolePermissionService } from '../services/role-permission.service';


@Component({
  selector: 'jd-dealer-management',
  templateUrl: './dealer-management.component.html',
  styleUrls: ['./dealer-management.component.scss']
})
export class DealerManagementComponent implements OnInit {

  showAddModal = false;
  dataTableModel: DataTableModel;
  ExecelFilterBody: DataLoadParams ;
  showUploadModal = false;
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
  regionIds:any;
  excelBody: any = {};
  showEditDoc = false;
  racfId:any;
  selectedModel: DealerManagementViewModel;
  permissionView:any;
  showTableData =  false;
  user = this.userService.getUserRoleId();
  constructor(
    private cdr: ChangeDetectorRef ,    
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private http: HttpClient,
    private roleService:RoleService,
    private usermanagementservice :UsermanagementService,
    private service : DealerManagementService,
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
    await this.rolepermission.getPermissionForModule(this.user,"Dealer Management");
    this.permissionView = await this.rolepermission.getRoleById("view_dealer");
  }

  getMasterData(filter:string){
    let options: SelectOptions[] = [];
    switch(filter){
      case 'regions':
        this.usermanagementservice.getRegion().then(regions=>{
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

  
  initDataTable() {
    this.dataTableModel = {
      options: {
        processing: true,
        serverSide: true,
        showFilter: false,
        exportExcel: false,
        hideSearchBar: true,
        fixedColumnsTo: 2,
        searchPlaceHolder:'Search For Dealer Name, Dealer ID',
        filters:[          
        //  {
        //     field: 'dateRangeEffective',
        //     type: 'dateRange',
        //     placeholder: 'Effective Date'
        //   },
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
            field: 'status',
            type: 'status',
          },    
        ],
        columns: [
          {
            title: 'Dealer Name',
            data: 'dealerName',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
            sortData:'dealerName',
          },
          {
            title: 'Dealer Code/ Dealer ID',
            data: 'dealerCode',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
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
            orderable: false,
          },

          {
            title: 'Contact number',
            data: 'contactNumber',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
          },
          {
            title: 'Region',
            data: 'regionName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                // if (data?.length > 1) {
                //   var tooltip= data?.map((x:any)=> x?.name);
                //   return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                // }
                return data || '-';
              }
              return '-';
            },
            orderable: false,
            // sortData: 'createdDate'
         
          },
          {
            title: 'Sub Region',
            data: 'subRegionName',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                // if (data?.length > 1) {
                //   var tooltip= data?.map((x:any)=> x?.name);
                //   return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                // }
                return data || '-';
              }
              return '-';
            },
            orderable: false,
            // sortData: 'createdDate'
         
          },
          {
            title: 'Division',
            data: 'divisionName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                // if (data?.length > 1) {
                //   var tooltip= data.map((x:any)=> x?.name);
                //   return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                // }
                return data || '-';
              }
              return '-';
            },
            orderable: false,
          }, {
            title: 'Market',
            data: 'marketName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                console.log(data)
                // if (data?.length > 1) {
                //   var tooltip= data.map((x:any)=> x?.name);
                //   return `${data[0]?.name} <span  title="${tooltip.toString()}" class="badge badge-secondary uxf-badge-count">+${data?.length - 1}</span>`;
                // }
                return data|| '-';
              }
              return '-';
            },
            orderable: false,
            // sortData: 'createdDate'
         
          },
          {
            title: 'Address',
            data: 'address',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
          },
          {
            title: 'Status',
            data: 'status',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
          },
          
        ],
        responsive: false,
        showActionMenu: true,
        showEditIcon:false,
        showDeleteIcon: false,
        // actionMenuItems: [],

        actionMenuItems: [
          // {
          //   label: 'Action',
          //   clickableClass: 'dt-edit-menu',
          //   icon: '<span class="uxf-icon dt-edit-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
          //   click: (rawData: any) => {
          //     this.showAddModal = true;
          //     // this.selectedModel = rawData;
          //   },
          // },
          // {
          //   label: '',
          //   clickableClass: 'dt-delete-menu',
          //   icon: '<span class="uxf-icon dt-delete-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
          //   click: (rawData: any) => {
          //     this.onDeleteAction(rawData)
          //   },
          // }
          
        ],
        exportClicked: () => {
          this.service.initiateExportExcel(this.ExecelSerchBody,this.ExecelFilterBody,this.racfId).then((res: any) => {
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
              if(field === 'status'){
                requestBody[field] = value;
                console.log(requestBody[field]);
              }
              
              else if(value?.length && field !== 'dateRange' && field !== 'dateRangeEffective'){
                requestBody[field] = value;
              }else if(field === 'dateRange' && value?.length){
                requestBody['fromDate'] = value[0];
                requestBody['toDate'] = value[1];
                console.log(value[0])
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
          const res = await this.service
           .getAll(params,requestBody);
            if (!res || !res.data) {
            return {
              totalRecords: 0,
              data: [],
            };
          }
          const viewModels = await Promise.all(res.data?.content.map((x: any) => DealerManagementModelMapper.mapToViewModel(x,null)));
          console.log(viewModels)
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
    if(this.permissionView){
      this.showTableData = true;
    }
  }

  downloadTemplate() {
    const url = this.service.getTemplateDownloadUrl(this.racfId);
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    DownloadUtil.downloadFile(this.http, url, 'dealerreport.xlsx' , 'dealer_report',this.ExecelSerchBody,this.ExecelFilterBody);
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

  // showConfirmation(status: string, model: UserManagementView) {
  //   this.modalService.show({
  //     title: status === 'Active' ? 'Activate User' : 'Deactivate User',
  //     message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this User?`,
  //     okText: 'Yes',
  //     okCallback: async () => {
  //       this.loading = true;
  //       try {
  //         let result: ApiResponse<UserManagementView>;
  //         if (status === 'Active') {
  //           result = await this.usermanagementservice.activate(model.userId);
  //         } else {
  //           result = await this.usermanagementservice.deactivate(model.userId);
  //         }
  //         if (ApiErrorUtil.isError(result)) {
  //           this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
  //         } else {
  //           // if(result?.message?.messageDescription.length)
  //           this.alertService.show(result?.message?.messageDescription );
  //           // else
  //           // this.alertService.show("Status Updated Successfully");
  //         }
  //       } catch (error) {
  //           this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Document Sub-Category', AlertType.Critical);
  //       }
  //       this.loading = false;
  //       this.modalService.publisher.next(null);
  //       this.dataTable.redrawGrid();
  //     },
  //     cancelText: 'No',
  //     cancelCallback: () => {
  //       this.modalService.publisher.next(null);
  //     },
  //     modalType: ModalType.warning,
  //     isSecondModal: false
  //   });
  // }

//   onDeleteAction(model: UserManagementView) {
//     this.modalService.show({
//       title: 'Delete User',
//       message: `Are you sure you want to delete this User?`,
//       okText: 'Yes',
//       okCallback: async () => {
//         this.loading = true;
//       try {
//         let result: ApiResponse<UserManagementView>;
//           result = await this.usermanagementservice.delete(model.userId);
//         if (ApiErrorUtil.isError(result)) {
//           this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
//         } else {
//           this.alertService.show(result?.message?.messageDescription );
//         }
//       } catch (error) {
//           this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete User', AlertType.Critical);
//       }
//       this.loading = false;
//       this.modalService.publisher.next(null);
//       this.dataTable.redrawGrid();
//       },
//       cancelText: 'No',
//       cancelCallback: () => {
//         this.modalService.publisher.next(null);
//       },
//       modalType: ModalType.warning,
//       isSecondModal: true
//     });
// }


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
    this.showAddModal = false;
    //this.dataTable.redrawGrid();
  }
  bulkUpload() {
    this.showUploadModal = true;
  }
  

}
