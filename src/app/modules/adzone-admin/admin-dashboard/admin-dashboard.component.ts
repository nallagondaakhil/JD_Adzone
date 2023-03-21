import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectorRef, ViewChild, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';
import * as echarts from 'echarts';
import { DashoardServiceService } from "../services/dashoard-service.service";
import { DashboardMaster } from "../models/dashboard-master.model";
import { RolePermissionService } from '../services/role-permission.service';
import { UserService } from 'src/app/core/services/user.service';
import { DataLoadParams, DataTableModel, FilterSettings } from 'src/app/shared/components/data-table/models/data-table-model';
import { formatDate } from '@angular/common';
import { RoleService } from '../services/role-management.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { RoleModelListMapper, RoleModelMapper, roleViewModel } from '../role-management/models/role-view.model';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { roleModel } from '../models/role-master.model';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'jd-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnChanges {
  docDownload: any;
  orderSummary: any;
  downUpload: any;
  colorPaletteDoc = ['#FEDE32', '#FDB02A', '#367C2B', '#BAB994', '#90EE90'];
  colorPaletteDownload = ['#367C2B', '#BAB994', '#FDB02A'];
  params: DataLoadParams;
  requestBody: any = {};
  dashboardCategoryArray: any = [];
  dummyactivity: any;
  tileData: any;
  activeTab = 1;
  yearFilter: any[];
  isDownload = 1;
  showFilters = false;
  mainParams: any = {};
  fillSelectedDate: any;
  filterSelectedDate:any;
  fillSelectedToDate: any;
  viewId: number = 1;
  minDate: any;
  showToDate = true;
  showOptions: boolean = false;
  years: number[] = [];
  currentYear: number = new Date().getFullYear();
  permissionView: any;
  permissionDownload: any;
  user = this.userService.getUserRoleId();
  @Input() model: DashboardMaster;
  previousUrl: string;
  docDownloadReport: any;
  permissionEdit: any;
  actionItem: any = [];
  showAddModal = false;
  selectedModel: roleViewModel;
  permissionDelete: any;
  dataTableModel: DataTableModel;
  dataTableModel1: DataTableModel;
  ExecelSerchBody = {};
  ExecelFilterBody: DataLoadParams;
  excelBody: any = {};
  permissionActivate: any;
  permissionDeactivate: any;
  showTableData = true;
  loading = false;
  @ViewChild('dataTable') dataTable: DataTableComponent;
DealerData:any[]=[];
DocumentData:any[]=[];
changeView1 = false;
changeView2 = false;
changeView3 = false;
currentDate: Date = new Date();
  fData: any;

  constructor(
    private service: DashoardServiceService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private rolepermission: RolePermissionService,
    private renderer: Renderer2,
    private router: Router,
    private roleService: RoleService,
    private alertService: AlertsService,
    private modalService: ModalDialogService,
    private masterData: MasterDataService) {
      const bodyElement = document.body;
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(res => {
        if (this.router.url == "/master/dashboard") {
          bodyElement.classList.add('dashboard-main');
        }
        else {
          bodyElement.classList.remove('dashboard-main');
        }
      });
      
      let data:any = JSON.parse(localStorage.getItem('changeView'))
      if(data){
        localStorage.removeItem('changeView')
      }
     }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  async ngOnInit(): Promise<void> {
    this.checkPermission().then(x => {
    });
     let params = {
      "page": 1,
      "size": 10,
      "sort": "desc",
      "searchKey": ""
  }
     this.dealerTable(params);
     this.documentTable(params);
    this.model = this.model || {} as any;
    this.docDownload = echarts.init(document.getElementById('document-graph'));
    this.orderSummary = echarts.init(document.getElementById('order-graph'));
    this.downUpload = echarts.init(document.getElementById('month-wise-graph'));
    this.docDownloadReport = echarts.init(document.getElementById('download-graph-report'));
    this.docDownloadSummaryChart(this.requestBody);
    this.docDownloadReportChart(this.requestBody);
    this.orderSummaryChart(this.requestBody);
    this.downloadChart(null);
    this.loadTiles({});
    this.model.year = [{ 'id': new Date().getFullYear(), 'name': new Date().getFullYear() }];
    // console.log(this.model.year);
    for (let i = (this.currentYear - 10); i < (this.currentYear + 10); i++) {
      this.years.push(i);
    }
    this.yearFilter = this.years.map((x: any, index: number) => {
      return { id: x, name: x }
    })

  }
  async checkPermission() {
    await this.rolepermission.getPermissionForModule(this.user, "Dashboard");
    this.permissionView = await this.rolepermission.getRoleById("view_access");

  }
  dealerTable(params){
    this.service.getTrndDealer(params).then(values => {
                console.log('getDealer',values)
                // let filterObjects = values.map((x: any) => x)
                this.DealerData =  values.map((x: any) => x)
                 
              });
  }
  documentTable(params){
    this.service.getTrndDocuments(params).then(values => {
                this.DocumentData =  values.map((x: any) => x)
                 console.log('this.DocumentData',this.DocumentData)
              });
  }
  async docDownloadSummaryChart(params) {
    const res = await this.service.getAllDocumentSummaryData(params);
    var downloadCategoryArray = [];
    var downloadvendorsArray = [];
    var downloaddealersArray = [];
    var downloadjdEmployeesArray = [];
    var downloadothersArray = [];
    const result = res.data;
    result.forEach((item) => {
      downloadCategoryArray.push(item.documentCategoryName);
      downloadvendorsArray.push(item.vendors);
      downloaddealersArray.push(item.dealers);
      downloadjdEmployeesArray.push(item.jdEmployees);
      downloadothersArray.push(item.others);

    })

    this.docDownload.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        // formatter: '{value} '
        formatter: (params) => {
          return "<b>" + params[0].name + "</b><br>" +
            "<span class='tooltip_text'>" + params[0].seriesName + "</span>: " + params[0].data + "<br>" +
            "<span class='tooltip_text'>" + params[2].seriesName + "</span>: " + params[2].data + "<br>" +
            "<span class='tooltip_text'>" + params[1].seriesName + "</span>: " + params[1].data + "<br>" +
            "<span class='tooltip_text'>" + params[3].seriesName + "</span>: " + params[3].data + "<br>" +
            "<span class= 'tooltip_text'>Total : </span>" + (parseFloat(params[0].data) + parseFloat(params[1].data) + parseFloat(params[2].data) + parseFloat(params[3].data))

        }
      },

      legend: {
        top: '2%',
        left: 'center'
      },

      xAxis: [
        {
          type: 'category',
          data: downloadCategoryArray,
          name:'Category',
          axisPointer: {
            type: 'shadow'
          }
        }
      ],

      yAxis: [
        {
          type: 'value',
          name: 'Doc Count',
          axisLabel: {
            formatter: '{value} '
          },
        },
      ],
      grid:[
        {
          width:310,
        }
      ],  
      dataZoom: [{
        start: 0,
        end: 10,
        type: "inside",
      },
      {
        start: 0,
        end: 50,
      }],

      series: [
        {
          name: 'Vendor',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: downloadvendorsArray
        },
        {
          name: 'Dealer',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: downloaddealersArray
        },
        {
          name: 'JD Employee',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: downloadjdEmployeesArray
        },
        {
          name: 'Others',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },

          data: downloadothersArray
        },

      ],
      color: this.colorPaletteDoc,
    })
  }
    async docDownloadReportChart(params) {
    const res = await this.service.getDocumentDownloadUploadReport(params);
    // const resDownload = await this.masterData.getDocumentDownloadReport();
    // const result = res;
    const resUpload:any[]=[]
    console.log('resp',res)
    var documentNameArray = [];
    var totalUploadArray = [];
    var totalDownloadArray = [];
    const result = res;
    const resultDownload:any[]=[];
    result.forEach((item) => {
      documentNameArray.push(item.fileType);
    })
    result.forEach((item) => {
      totalDownloadArray.push(item.download);
    })
    result.forEach((item) => {
      totalUploadArray.push(item.upload);
    })
    console.log('respdata',documentNameArray,)
    const seriesLabel = {
      show: true
    } as const;
    this.docDownloadReport.setOption({

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        top: '2%',
      left: 'center'
    },
      // grid: {
      //   left: '3%',
      //   right: '4%',
      //   bottom: '3%',
      //   containLabel: true
      // },
      xAxis: {
        type: 'category',
        data: documentNameArray,
        name:'File Type',
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Document Count',
        axisLabel: {
          formatter: '{value} '
        },
        
      },
      dataZoom: [{
        start: 0,
        end: 10,
        type: "inside",
      },
      {
        start: 0,
        end: 50,
      }],
      series: [
        {
          name: 'Document Uploaded',
          type: 'bar',
          color: '#367c2b',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: totalUploadArray
        },
        {
          name: 'Document Downloaded',
          type: 'bar',
          color: '#fdb02a',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: totalDownloadArray
        }
      ]
    });
  }
  async orderSummaryChart(params: any) {

    const res = await this.service.getAllOrderSummaryData(params);
    const result = res.data;
    //   var dataresult = Object.entries(result).map((e) => ( { [e[0]]: e[1] } ));
    //   var orderSummaryData = dataresult.map((x: any) => { 
    //     return { value: Object.keys(x), name: Object.values(x) }
    // })

    // console.log(orderSummaryData);

    //this.dashboardOrderArray.push({result});
    //console.log(this.dashboardOrderArray);
    this.orderSummary.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '2%',
        left: 'center'
      },
      series: [
        {
          name: 'Order Summary',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            fontSize: 10,
            formatter: function (a: any) {
              if (a.data.value > 0)
                return a.data.value
              else
                return ''
            }
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '40',
          //     fontWeight: 'bold'
          //   }
          // },
          labelLine: {
            show: false
          },
          data: [
            { value: result.pending, name: 'Pending' },
            { value: result.processed, name: 'Processed' },
            { value: result.delivered, name: 'Delivered' },
            { value: result.cancelled, name: 'Cancelled' },
            { value: result.onHold, name: 'On-hold' },

          ],
          color: this.colorPaletteDoc,
        },

      ]
    })
  }
  yearFilterChange(event: any) {
    if (event?.length) {
      let yearId = {};
      //this.model.year =yearId;
      yearId["year"] = this.model.year[0].id;
      this.downloadChart(yearId);
    }
  }
  async downloadChart(year: any) {
    // console.log(year)
    var numDealers = [];
    var numJdUser = [];
    var numOthers = [];
    var numUAdmin = [];
    var numUSubAdmin = [];
    var numUOthers = [];
    var maxValue = 0;
    if (this.isDownload == 1) {
      const res = await this.service.getMonthDownload(year);
      const result = res.data;
      maxValue = Math.max.apply(Math, result.map(function (item) { return (Math.ceil(item.total / 100) * 100) }))
      result.forEach((item) => {
        numDealers.push(item.dealers);
        numJdUser.push(item.vendors);
        numOthers.push(item.others);
      })
    } else {
      const res = await this.service.getMonthUpload(year);
      const result = res.data;
      maxValue = Math.max.apply(Math, result.map(function (item) { return (Math.ceil(item.total / 100) * 100) }))
      result.forEach((item) => {
        numUAdmin.push(item.superAdmin);
        numUSubAdmin.push(item.subRegionAdmin);
        numUOthers.push(item.others);
      })
    }

    this.downUpload.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },

      legend: {
        bottom: '2%',
        left: 'center'
      },
      xAxis: [
        {
          type: 'category',
          name:'Month',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Document Count',
          axisLabel: {
            formatter: '{value} '
          }
        },
      ],
      series: [
        {
          name: this.isDownload ? 'Dealer' : 'Super Admin',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: this.isDownload ? numDealers : numUAdmin
        },
        {
          name: this.isDownload ? 'JD Employee' : 'Sub Region Admin',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'inside',
            // verticalAlign: 'middle',
            rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: this.isDownload ? numJdUser : numUSubAdmin
        },
        {
          name: 'Others',
          type: 'line',
          smooth: true,
          // yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          label: {
            show: true,
            position: 'top',
            // verticalAlign: 'middle',
            // rotate: 90,
            fontSize: 11,
            formatter: function (a: any) {
              // console.log(a)
              if (a.data > 0)
                return a.data
              else
                return ''
            }
          },
          data: this.isDownload ? numOthers : numUOthers
        }
      ],
      color: this.colorPaletteDownload,
    })
  }

  async loadTiles(params: any) {
    const result = await this.service.getTileData(params);
    if (result.data) {
      this.tileData = result.data
    }
  }

  setActiveTab(tab: number, tabName: string) {
    this.activeTab = tab;
    if (tab == 1) {
      this.isDownload = 1;
    } else if (tab == 2) {
      this.isDownload = 0;
    }
    let yearId = {};
    yearId["year"] = this.model.year[0].id;
    this.downloadChart(yearId);
  }

  onFilterClick() {
    let data:any = JSON.parse(localStorage.getItem('changeView'))
    console.log('dtaa',this.filterSelectedDate)
    if ($(".filter-container").length > 0) {
      this.showFilters = false;
      localStorage.removeItem("changeView")
    }
    else {
      this.showFilters = true;
      this.showOptions = true;
      this.changeView(data)
    }
    this.cdr.detectChanges();
  }

  changeView(id: any) {
    this.fillSelectedDate = true;
    this.viewId = id;
    localStorage.setItem('changeView',JSON.stringify(id))
    if(this.viewId==1){
      this.changeView1 = true;
      this.changeView2 = false;
      this.changeView3 = false;
    }
    else if(this.viewId==2){
      this.changeView1 = false;
      this.changeView2 = true;
      this.changeView3 = false;
    }
    else if(this.viewId==3){
      console.log('viewid3')
      this.changeView1 = false;
      this.changeView2 = false;
      this.changeView3 = true;
    }
  }
  dateValidation() {
    console.log(this.filterSelectedDate)
    this.cdr.detectChanges()
    this.showToDate = false
    if (this.filterSelectedDate && this.filterSelectedDate.length)
      this.minDate = this.filterSelectedDate[0]
    this.cdr.detectChanges();
    this.showToDate = true;
    this.cdr.detectChanges();
  }
  async onfiltersubmit(fData: any) {
    console.log(fData)
    var today = new Date();
    this.mainParams = {};
    this.fData = fData;

    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (fData.filterDate?.length) {
      this.mainParams['startDate'] = fData.filterDate[0];
      // this.mainParams['endDate'] = fData.filterDate[1];
    }
    if (fData.filterToDate?.length) {
      // this.mainParams['startDate'] = fData.filterToDate[0];
      this.mainParams['endDate'] = fData.filterToDate[0];
    }
    if (this.viewId === 1) {
      this.mainParams['date'] = dd;
      this.mainParams['month'] = mm;
      this.mainParams['year'] = yyyy;
    }
    if (this.viewId === 2) {
      this.mainParams['month'] = mm;
      this.mainParams['year'] = yyyy;
    }
    if (this.viewId === 3) {
      this.mainParams['year'] = yyyy;
    }
    let requestBody: any = {};
    let settings:any
    requestBody = { ...this.mainParams, ...requestBody };
    console.log(requestBody,this.mainParams)
    this.loadTiles(requestBody);
    this.docDownloadSummaryChart(requestBody);
    this.orderSummaryChart(requestBody);
    this.docDownloadReportChart(requestBody);
    this.dealerTable(requestBody);
    this.documentTable(requestBody);
  }

  clearFilter() {
    this.showOptions = false;
    this.showToDate = false;
    this.fillSelectedDate = false;
    this.fillSelectedToDate = null
    this.cdr.detectChanges();
    let requestBody: any = {};
    this.mainParams = {};
    this.loadTiles(requestBody);
    this.docDownloadSummaryChart(requestBody);
    this.orderSummaryChart(requestBody);
    this.docDownloadReportChart(requestBody);
    this.dealerTable(requestBody);
    this.documentTable(requestBody);
    this.showOptions = true;
    this.showToDate = true;
    this.changeView1 = false;
      this.changeView2 = false;
      this.changeView3 = false;
      this.viewId = 0;
    // this.cdr.detectChanges();

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
}
