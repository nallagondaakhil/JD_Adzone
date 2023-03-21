import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings, SelectOptions } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { MasterDataModel } from '../../admin/models/master-data.model';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { MasterDataService } from '../../admin/services/master-data.service';
import { MockDataService } from '../../showcase/mock-data.service';
import { OrderAdminService } from '../services/admin-order.service';
import { DocumentCategoryService } from '../services/doc-cat.service';
import { AdminOrderModelMapper, OrderAdminViewModel, SelectedOrderViewModel } from './models/admin-order-view.model';
import { RolePermissionService } from '../services/role-permission.service';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'jd-admin-order-list',
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.scss']
})
export class AdminOrderListComponent implements OnInit {

  showDetailedView = false;
  iscompanyEdit = false;
  dataTableModel: DataTableModel;
  showUploadModal = false;
  ExecelFilterBody: DataLoadParams;
  ExecelSerchBody = {};
  totalselectedrecords:number;
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
  selectedModel: OrderAdminViewModel;
  selectedall = false;
  uncheckedOrder: any = [];
  checkedOrder: any = [];
  selectorderfromdropdown = true;
  modelOrder: SelectedOrderViewModel[] = [];
  viewModels: OrderAdminViewModel[] = [];
  findselection = false;
  selectedStatus: MasterDataModel[];
  statusOptions: MasterDataModel[] = [];
  permissionView:any;
  user = this.userService.getUserRoleId();
  showTableData =  false;
  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private mockData: MockDataService,
    private docService: DocumentCategoryService,
    private http: HttpClient,
    private service: OrderAdminService,
    private masterservice:MasterDataService,
    private userService:UserService,
    private rolepermission:RolePermissionService,
  ) { }

  async ngOnInit(): Promise<void> {
    
    this.checkPermission().then(x => {
      this.initDataTable();
    });
    this.statusOptions = await this.service.getStatus();
  }
  async checkPermission(){
    await this.rolepermission.getPermissionForModule(this.user,"Order Management");
    this.permissionView = await this.rolepermission.getRoleById("view_order");
  }

  ngAfterViewChecked() {
  //   if(document.getElementById("selectall") && this.findselection == false){
      this.selectall();
  //     this.findselection = true;
  //     console.log(document.getElementById("selectall"))

  //   }
  }

  getMasterData(filter:string){
    let options: SelectOptions[] = [];
    switch(filter){
      case 'status':
        console.log(this.service.getStatus())
        this.service.getStatus().then(status=>{
          status.forEach(stat=>{
            options.push(stat);
          });
        });
        break;
      case 'orderType':
        console.log(this.service.getOrderPlaced())
        this.service.getOrderPlaced().then(orderType=>{
          orderType.forEach(orderType=>{
            options.push(orderType);
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
        searchPlaceHolder: 'Search For RACFID , Order Number',
        filters: [
          {
            field: 'dateRange',
            type: 'dateRange',
            placeholder: 'Date Range',
            maxDate: new Date()
          },
          // {
          //   field: 'statusOrder',
          //   type: 'statusOrder',
          //   placeholder: 'Order Status',
          //   selectOptions: this.getMasterData('status')
          // },
          // {
          //   field: 'orderType',
          //   type: 'orderType',
          //   placeholder: 'Order Type',
          //   selectOptions: this.getMasterData('orderType')
          // },
        ],
        columns: [
          // {
          //   title: this.selectedall ? `<div class="custom-control custom-checkbox">
          //   <input  type="checkbox" class="custom-control-input " id="selectall"  checked >
          //    <label class="custom-control-label" for="selectall"></label>
          //     </div> `: `<div class="custom-control custom-checkbox">
          //     <input  type="checkbox" class="custom-control-input " id="selectall" >
          //      <label class="custom-control-label" for="selectall"></label>
          //       </div> `,
          //   data: '',
          //   className: 'fixed-column',
          //   render: (data: any, type: any, full: any) => {
          //     let temp = this.uncheckedOrder.filter((x: any) => x == full.orderId)

          //     let tempchecked = this.checkedOrder.filter((x: any) => x == full.orderId)
              

          //     if ((this.selectedall && temp?.length == 0) || tempchecked?.length)
          //       full.isChecked = true;

          //     if (full.isChecked) {
          //       return `<div class="custom-control custom-checkbox">
          //       <input checked  type="checkbox" class="custom-control-input sub-checkbox" id="`+ full.orderId + `">
          //       <label class="custom-control-label" for="`+ full.orderId + `"></label>
          //   </div>`;
          //     }
          //     return `<div class="custom-control custom-checkbox">
          //        <input [checked]='true'  type="checkbox" class="custom-control-input sub-checkbox" id="`+ full.orderId + `">
          //        <label class="custom-control-label" for="`+ full.orderId + `"></label>
          //    </div>`;
          //   },
          //   orderable: false,
          //   onClick: (rawData: any, event: any) => {
          //     // if(event.target.isChecked.length)
          //     // {
          //     //   this.selectcountryfromdropdown = false;
          //     // }
          //     if (event.target.checked) {
          //       rawData.isChecked = true;
          //       this.checkedOrder.push(rawData.orderId)

          //       if (this.checkedOrder?.length == 0) {
          //         this.selectorderfromdropdown = true;
          //       } else {
          //         this.selectorderfromdropdown = false;
          //       }
          //       //  let selectedcheckedcountry = this.uncheckedcountry.filter((x:any)=>x== rawData.id);
          //       this.uncheckedOrder.forEach((element: any, index: any) => {
          //         if (element == rawData.orderId) {
          //           this.uncheckedOrder.splice(index, 1)
          //         }

          //       });

          //     } else {
          //       // this.selectedall = false;
          //       // $("#selectall").prop("checked",false)
          //       this.checkedOrder.forEach((element: any, index: any) => {
          //         if (element == rawData.orderId) {
          //           this.checkedOrder.splice(index, 1)
          //         }

          //       });
          //       if (this.checkedOrder?.length == 0 && !this.selectedall) {
          //         this.selectorderfromdropdown = true;
          //       } else {
          //         this.selectorderfromdropdown = false;
          //       }

          //       this.uncheckedOrder.push(rawData.orderId);
          //     }

          //   },
          //   clickableElementClas: 'sub-checkbox'
          // },
          {
            title: 'Order Number',
            data: 'orderNumber',
            className: 'fixed-column',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `<span title= ${data}> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
            sortData: 'orderNumber',
          },
          {
            title: 'Order Date',
            data: 'orderOn',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `${formatDate(data, 'dd-MM-yyyy h:mm:ss a', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: false,
            sortData: 'orderOn',
          },
          {
            title: 'Product Name',
            data: 'documentName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
            sortData: 'documentName',
          },
          {
            title: 'Quantity',
            data: 'quantity',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `<span title= ${data}> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
            // sortData: 'quantity'

          },
          // {
          //   title: 'Total',
          //   data: 'total',
          //   render: (data: any, type: any, full: any) => {
          //     if (data) {
          //       return `<span title= ${data}> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          //   orderable: false,
          // },
          {
            title: 'RACF ID',
            data: 'racfId',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `<span title= ${data}> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
          },
          // {
          //   title: 'Email ID',
          //   data: 'total',
          //   render: (data: any, type: any, full: any) => {
          //     if (data) {
          //       return `<span title= ${data}> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          // },
          // {
          //   title: 'Contact Number',
          //   data: 'total',
          //   render: (data: any, type: any, full: any) => {
          //     if (data) {
          //       return `<span title= ${data}> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          // },
          // {
          //   title: 'Address',
          //   data: 'address',
          //   render: (data: any, type: any, full: any) => {
          //     if (data) {
          //       return `<span title= ${data}> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          //   orderable: false,
          // },
          // {
          //   title: 'Order Type',
          //   data: 'displayProductFlag',
          //   render: (data: any, type: any, full: any) => {
          //     if (data) {
          //       return `<span title= ${data}> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          //   orderable: false,
          // },
          {
            title: 'Status',
            data: 'orderStatus',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return `<span title= Downloaded> Downloaded  </span>`
              }
              return '-';
            },
            orderable: false,
          },
        ],
        responsive: false,
        showActionMenu: true,
        showEditIcon: false,
        showDeleteIcon: false,
        showViewIcon: false,
        // actionMenuItems: [],
        // actionMenuItems: [
        //   {
        //     label: 'Action',
        //     clickableClass: 'dt-view-menu',
        //     icon: '<span class="dt-view-menu uxf-icon " title="View"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg></span>',
        //     click: (rawData: any) => {
        //       this.selectedModel = rawData;
        //       console.log(this.selectedModel)
        //       this.showDetailedView = true;
        //       console.log(this.showDetailedView)
        //     },
        //   },
        // ],
        exportClicked: () => {
          this.service.initiateExportExcel(this.ExecelSerchBody, this.ExecelFilterBody).then((res: any) => {
            if (ApiErrorUtil.isError(res) || !res.message?.messageDescription) {
              this.alertService.show(ApiErrorUtil.errorMessage(res) || 'Failed to export data', AlertType.Critical);
            } else {
              this.alertService.show(res.message?.messageDescription);
            }
          });
        },
        showSerialNo: true
      },
      // onRawClick: (rawData: any) => {
      //   this.selectedModel = rawData;
      //   console.log(this.selectedModel)
      //   this.showDetailedView = true;
      //   console.log(this.showDetailedView)
      // },
      loadData: async (params: DataLoadParams, settings) => {
        try {
          let requestBody: any = {};
          if (params.filters != undefined) {
            console.log("filter",params.filters)
            params.filters.forEach((value, field) => {
              console.log(field)
              if (field === 'statusOrder') {
                console.log(value)
                requestBody['orderStatus'] = value[0].name;
              }
              else if (field === 'dateRange' && value?.length) {
                requestBody['fromDate'] = value[0];
                requestBody['toDate'] = value[1];
              } 
              else if(field === 'orderType'){
                console.log(field)
                requestBody['productFlag'] = value[0].id;
              }
              else if(value?.length && field !== 'dateRange') {
                requestBody[field] = value;
              }
            });
          }
          this.ExecelFilterBody = requestBody;
          this.ExecelSerchBody = params;
          delete params.filters;
          this.excelBody = { ...params, ...requestBody }
          const res = await this.service
            .getAll(params, requestBody);
          // .getAllData(0,10)
          if (!res || !res.data || !res.data.content) {
            // if (!res || !res.data || !res.data) {

            return {
              totalRecords: 0,
              data: [],
            };
          }
          this.viewModels = await Promise.all(res.data?.content.map((x: any) => AdminOrderModelMapper.mapToViewModel(x, null)));
          this.totalselectedrecords = res.data.totalElements || 0;
          return {
            totalRecords: res.data.totalElements || 0,
            data: this.viewModels || [],
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
      this.showTableData=true;
    }
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
    this.showDetailedView = false;
    this.dataTable.redrawGrid();
  }

  selectall() {

    var that = this;

    $("#selectall").on("click", function (e) {
      if ($(this).is(":checked")) {
        // if (JSON.stringify(that.ExecelFilterBody) == "{}") {
        //   $("#selectall").prop("checked", false)
        //   that.onFilterClick();

        //   return
        // }
        that.selectedall = true;
        that.uncheckedOrder = [];
        if (that.selectedall = true) {
          that.selectorderfromdropdown = false;
        }
        $(".sub-checkbox").each(function (key, value) {

          $(value).prop("checked", true)

        })
        that.viewModels.forEach(element => {

          element.isChecked = true;


        });
      }
      else {
        that.selectedall = false;
        that.selectorderfromdropdown = true;
        $("#selectall").prop("checked", false)

        $(".sub-checkbox").each(function (key, value) {
          $(value).prop("checked", false)
        })
        that.viewModels.forEach(element => {

          element.isChecked = false;

        });
      }
    });
  }

  SelectStatus(){
    let checkedcount = this.selectedall?this.totalselectedrecords:this.checkedOrder?.length;
    let statusIDs:string;
    console.log("selectedStatus",this.selectedStatus)
    this.selectedStatus?.forEach(status => {
      statusIDs = status.name;
      console.log(statusIDs)
    //   if(this.selectedall == true && this.uncheckedcountry.length){ this.alertService.show('Invalid RACF ID', AlertType.Critical);
    // }else{
      return new Promise((resolve) => {
        this.modalService.show({
          title: 'status Update',
          message: `Are sure you want to update the status for the selected orders?`,
          okText: 'Yes',
          okCallback: async () => {
            let isSelectall= this.selectedall ? 1:0;
            let id = []; 
            // var test = [];
            try{
              let statusselection : ApiResponse<OrderAdminViewModel>;
        
              if(this.selectedall == true)
              {
                // id = [-1];  
                id.length = 0;  
                id.push({'orderStatus':-1})                
              
              }
              else
              {
                if(this.uncheckedOrder.length)
                {
                //  id=[-1]
                id.length = 0;  
                id.push({'orderStatus':-1})  
                }else{
                  let temp =  this.viewModels.filter(x=>x.isChecked == true)
                  temp.forEach(element => {

                    // id.push(element.orderId);
                    id.push({"orderId":element.orderId,"orderStatus":statusIDs})
                  });
              }
                
            }
              statusselection = await this.service.updateStatus(id,isSelectall,this.uncheckedOrder,statusIDs,this.ExecelSerchBody,this.ExecelFilterBody)
              if (ApiErrorUtil.isError(statusselection) || !statusselection.message?.messageDescription) {
                this.alertService.show(ApiErrorUtil.errorMessage(statusselection) || 'Failed to Update records', AlertType.Critical);
              } else {
                if(checkedcount > 5000){
                  this.alertService.show('only Selected 5000 records are Successfuly updated', AlertType.Info);            
                }else{
                  
                this.alertService.show(statusselection.message?.messageDescription);
                }
              }
              this.selectedall = false;
               this.checkedOrder = [];
              this.uncheckedOrder= [];
              this.selectedStatus = [];
              this.selectorderfromdropdown = true;
              $("#selectall").prop("checked",false);
              $(".sub-checkbox").each(function (key, value) {
                $(value).prop("checked", false)
              })
              this.viewModels.forEach(element => {
      
                element.isChecked = false;
      
              });
              this.dataTable.redrawGrid()
            }
            catch(e){}
            this.modalService.publisher.next(null);
            resolve(true);
            //window.location.reload();
          },
          cancelText: 'No',
          cancelCallback: () => {
            this.modalService.publisher.next(null);
            resolve(false);
          },
          modalType: ModalType.warning,
          isSecondModal: true
        });
      });
  //  }
    });
  
  }

  downloadTemplate() {
    const url = this.service.getTemplateDownloadUrl();
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");

    DownloadUtil.downloadFile(this.http, url, 'orderlist.xlsx' , 'order_list',this.ExecelSerchBody,this.ExecelFilterBody);
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

}
