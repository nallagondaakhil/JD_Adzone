import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { MockDataService } from '../../showcase/mock-data.service';
import { roleModel } from '../models/role-master.model';
import { RoleService } from '../services/role-management.service';
import { RoleModelListMapper, RoleModelMapper, roleViewModel } from './models/role-view.model';
import { RolePermissionService } from '../services/role-permission.service';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'jd-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

  showAddModal = false;
  iscompanyEdit = false;
  dataTableModel: DataTableModel;
  showUploadModal = false;
  ExecelFilterBody: DataLoadParams;
  ExecelSerchBody = {};

  @ViewChild('dataTable') dataTable: DataTableComponent;
  showImport = false;
  searchClicked = false;
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
  selectedModel: roleViewModel;
  @Input() model: roleViewModel;
  permissionView: any;
  permissionAdd: any;
  permissionEdit: any;
  permissionActivate: any;
  permissionDeactivate: any;
  permissionDelete: any;
  actionItem: any = [];
  showTableData = false;
  user = this.userService.getUserRoleId();
  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private mockData: MockDataService,
    private roleService: RoleService,
    private http: HttpClient,
    private userService: UserService,
    private rolepermission: RolePermissionService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.checkPermission().then(x => {
      this.initDataTable();
    });

  }

  async checkPermission() {
    await this.rolepermission.getPermissionForModule(this.user, "Role Management");
    this.permissionView = await this.rolepermission.getRoleById("view_role");
    this.permissionAdd = await this.rolepermission.getRoleById("create_role");
    this.permissionEdit = await this.rolepermission.getRoleById("edit_role");
    this.permissionActivate = await this.rolepermission.getRoleById("activate_role");
    this.permissionDeactivate = await this.rolepermission.getRoleById("deactivate_role");
    this.permissionDelete = await this.rolepermission.getRoleById("delete_role");
  }

  initDataTable() {
    if (this.permissionEdit) {
      this.actionItem.push(
        {
          label: 'Action',
          clickableClass: 'dt-edit-menu',
          icon: '<span class="uxf-icon dt-edit-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
          click: (rawData: any) => {
            // if(rawData.roleName == 'Sub Region Admin' || rawData.roleName == 'Dealer' || rawData.roleName == 'Super Admin' || rawData.roleName == 'John Deere Employee' || rawData.roleName == 'Vendor'){
            //   this.showAddModal = false;
            //   this.alertService.show("Can't able to access",AlertType.Warning);
            //   }else{
              this.showAddModal = true;
              this.selectedModel = rawData;
            // }
          },
        })
    }
    if (this.permissionDelete) {
      this.actionItem.push(
        {
          label: this.permissionEdit ? '' : 'Action',
          clickableClass: 'dt-delete-menu',
          icon: '<span class="uxf-icon dt-delete-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
          click: (rawData: any) => {
              if(rawData.roleName == 'Sub Region Admin' || rawData.roleName == 'Dealer' || rawData.roleName == 'Super Admin' || rawData.roleName == 'John Deere Employee' || rawData.roleName == 'Vendor'){
              this.alertService.show("Default role cannot be deleted...",AlertType.Warning);
              }else{
              this.onDeleteAction(rawData)
          }
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
        searchPlaceHolder: 'Search For Role',
        filters: [
          {
            field: 'dateRange',
            type: 'dateRange',
            placeholder: 'Created Date Range',
            maxDate: new Date()
          },
          {
            field: 'isActive',
            type: 'status',
          },
        ],
        columns: [
          // {
          //   title: 'Role ID',
          //   data: 'roleId',
          //   render: (data: any, type: any, full: any) => {
          //     if (data ) {

          //       return  `<span title= "${data}"> ${data}  </span>`
          //     }
          //     return '';
          //   },
          //   orderable: true,
          // },
          {
            title: 'Role Name',
            data: 'roleName',
            render: (data: any, type: any, full: any) => {

              if (data) {
                return `<span title= "${data}"> ${data}  </span>`
              }
              return '';
            },
            orderable: true,
          },
          {
            title: 'Created By',
            data: 'createdBy',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Created Date',
            data: 'createdDate',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `${formatDate(data, 'dd-MM-yyyy h:mm:ss a', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: true,
            // sortData: 'createdDate',
          },
          {
            title: 'Last Updated',
            data: 'updatedDate',
            render: (data: any, type: any, full: any) => {
              if (data) {
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
        showEditIcon: false,
        showDeleteIcon: false,
        actionMenuItems:
          this.actionItem,
        exportClicked: () => {
          this.roleService.initiateExportExcel(this.ExecelSerchBody, this.ExecelFilterBody).then((res: any) => {
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
          if (params.filters != undefined) {
            params.filters.forEach((value, field) => {
              if (field === 'isActive') {
                requestBody[field] = value;
              }
              else if (value?.length && field !== 'dateRange' && field !== 'dateRangeEffective') {
                requestBody[field] = value;
              } else if (field === 'dateRange' && value?.length) {
                // var fromDate = value[0].toISOString().replace("T"," ").replace("Z","");
                // var toDate = value[1].toISOString().replace("T"," ").replace("Z","");
                var fromDate = value[0]
                var toDate = value[1]
                console.log(value[0])
                // requestBody['fromDate'] = fromDate;
                // requestBody['toDate'] = toDate;
                requestBody['fromDate'] = new Date(new Date(value[0]).setDate(new Date(value[0]).getDate() + 1))
                requestBody['toDate'] = new Date(new Date(value[1]).setDate(new Date(value[1]).getDate() + 1))
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
          this.ExecelSerchBody = params;
          delete params.filters;
          this.excelBody = { ...params, ...requestBody }
          const res = await this.roleService
            .getAll(params, requestBody);
          if (!res || !res.data || !res.data.content) {
            return {
              totalRecords: 0,
              data: [],
            };
          }
          const viewModels = await Promise.all(res.data?.content.map((x: any) => RoleModelListMapper.mapToViewModel(x, null)));
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
    if (this.permissionActivate || this.permissionDeactivate) {
      this.dataTableModel.options.columns.push(
        {
          title: 'Status',
          data: 'activateFlag',
          render: (data: any, type: any, full: any) => {
            if (data === "Active")
              return `<span class="active-change" title="` + data + `"><svg focusable="false" aria-hidden="true" fill="#367c2b" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></span>`
            else
              return `<span class="active-change" title="` + data + `"><svg focusable="false" aria-hidden="true" fill="#c21020" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>`
          },
          onClick: (rawData: any) => {
            if(rawData.roleName == 'Sub Region Admin' || rawData.roleName == 'Dealer' || rawData.roleName == 'Super Admin' || rawData.roleName == 'John Deere Employee' || rawData.roleName == 'Vendor'){
              this.alertService.show("Default role cannot be de-activated...",AlertType.Warning);
            }else{
              if (rawData.activateFlag === "Active") {
                this.showConfirmation('Inactive', rawData);
              } else if (rawData.activateFlag === "Inactive") {
                this.showConfirmation('Active', rawData);
              }
            }
          },
          orderable: false,
          clickableElementClas: 'active-change'
        })
    }
    if (this.permissionView) {
      this.showTableData = true;
    }
  }
  downloadTemplate() {
    const url = this.roleService.getTemplateDownloadUrl();
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    DownloadUtil.downloadFile(this.http, url, 'role_report.xlsx', 'role', this.ExecelSerchBody, this.ExecelFilterBody);
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
  showConfirmation(status: string, model: roleViewModel) {
    this.modalService.show({
      title: status === 'Active' ? 'Activate Role' : 'Deactivate Role',
      message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this Role?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
        try {
          let result: ApiResponse<roleModel>;
          if (status === 'Active') {
            result = await this.roleService.activate(model.roleId);
          } else {
            result = await this.roleService.deactivate(model.roleId);
          }
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.alertService.show(result?.message?.messageDescription);
          }
        } catch (error) {
          this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Role.', AlertType.Critical);
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
  onDeleteAction(model: roleViewModel) {
    this.modalService.show({
      title: 'Delete Role',
      message: `Are you sure you want to delete this Role?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
        try {
          let result: ApiResponse<roleModel>;
          result = await this.roleService.delete(model.roleId);
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.alertService.show(result?.message?.messageDescription);
          }
        } catch (error) {
          this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete Role', AlertType.Critical);
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
  addRecord() {
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

  onSearchKeyup(val: string) {

  }

  onFilterClick() {
    this.filterDialogTop = (this.filterButton.nativeElement.offsetTop + this.filterButton.nativeElement.offsetHeight);
    let filterDialogOffsetRight = (this.filterButton.nativeElement.offsetLeft + this.filterButton.nativeElement.offsetWidth);
    this.filterDialogRight = window.innerWidth - filterDialogOffsetRight;
    this.filterDialogWidth = filterDialogOffsetRight - this.filterButton.nativeElement.offsetLeft;
    this.showFilterDialog = !this.showFilterDialog;
    this.cdr.detectChanges();
  }

  onCloseFilter() {
    this.showFilterDialog = false;
    this.dataTable.onCloseFilter();
    this.filterApplied = false;
  }

  onFilterCallback(options: FilterSettings[]) {
    this.dataTable.onFilterCallback(options);
    this.showFilterDialog = !this.showFilterDialog;
  }

  onFilterUpdated(value: boolean) {
    this.filterApplied = value;
  }
  onCloseAddModal(e: any) {
    // window.location.reload();
    this.showAddModal = false;
    this.dataTable.redrawGrid();
  }


}
