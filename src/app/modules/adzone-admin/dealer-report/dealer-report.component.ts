import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings, SelectOptions } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { MockDataService } from '../../showcase/mock-data.service';
import { CategoryCountReportModelMapper } from '../document-category-count/models/document-cat-count-report-view.model';
import { CategoryCountService } from '../services/document-cat-count-report.service';

@Component({
  selector: 'jd-dealer-report',
  templateUrl: './dealer-report.component.html',
  styleUrls: ['./dealer-report.component.scss']
})
export class DealerReportComponent implements OnInit {


  showAddModal = false;
  dataTableModel: DataTableModel;
  ExecelFilterBody: DataLoadParams ;
  showUploadModal = false;
  ExecelSerchBody = {};
  excelBody: any = {};
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
  constructor( private mockData: MockDataService, 
    private cdr: ChangeDetectorRef , private service : CategoryCountService,
    private alertService:AlertsService,private http:HttpClient ) { }

  ngOnInit(): void {
    this.initDataTable();
  }


  getMasterData(filter:string){
    let options: SelectOptions[] = [];
    switch(filter){
     

        case 'dealerReport':
          this.service.getDealer().then(dealerCode=>{
            dealerCode.forEach(dealer=>{
              options.push(dealer);
            });
          });
          break;
        // case 'regions':
        // // this.usermanagementservice.getRegion().then(regions=>{
        // //   regions.forEach(region=>{
        // //     options.push(region);
        // //   });
        // // });
        // break;
     
   
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
        searchPlaceHolder:'Search For User Name, RACF ID',
        filters:[
          {
            field: 'dealerReport',
            type: 'dealerReport',
            placeholder: 'Dealer',
            selectOptions: this.getMasterData('dealerReport')
           },
        //   {
        //     field: 'regions',
        //     type: 'region',
        //     placeholder: 'Region',
        //     selectOptions: this.getMasterData('regions')
        //   },
        //   {
        //     field: 'subRegions',
        //     type: 'sub-region',
        //     placeholder: 'Sub-Region',
        //     //selectOptions: this.getMasterData('subregions')
        //   },
        //   {
        //     field: 'divisions',
        //     type: 'division',
        //     placeholder: 'Division',
        //     //selectOptions: this.getMasterData('divisions')
        //   },
        //   {
        //     field: 'markets',
        //     type: 'market',
        //     placeholder: 'Market',
        //     //selectOptions: this.getMasterData('countries')
        //   }, 
        //   {
        //     field: 'dateRange',
        //     type: 'dateRange',
        //     placeholder: 'Created Date Range',
        //     maxDate: new Date()
        //   },
          
        // //  {
        // //     field: 'dateRangeEffective',
        // //     type: 'dateRange',
        // //     placeholder: 'Effective Date'
        // //   },
        //   {
        //     field: 'activateFlag',
        //     type: 'status',
        //   },    
        ],
        columns: [
          {
            title: 'RACF ID',
            data: "racfId",
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
            data: "userName",
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Dealer Code',
            data: "dealerCode",
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Dealer Name',
            data: "dealerName",
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
         
          {
            title: 'Log In Date',
            data: 'logInTime',
            render: (data: any, type: any, full: any) => {
              if (data) {
                console.log(data)
                return  `${formatDate(data, 'dd-MM-yyyy', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: true,
             //sortData: 'createdDate'
         
          }, 
          {
            title: 'Log In Time',
            data: 'logInTime',
            render: (data: any, type: any, full: any) => {
              if (data) {
                console.log(data)
                return  `${formatDate(data, 'h:mm:ss a', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: true,
             //sortData: 'createdDate'
         
          }, 
          {
            title: 'Log Out Date',
            data: 'logOutTime',
            render: (data: any, type: any, full: any) => {
              if (data) {
                console.log(data)
                return  `${formatDate(data, 'dd-MM-yyyy', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: true,
             //sortData: 'createdDate'
         
          }, 
          {
            title: 'Log Out Time',
            data: 'logOutTime',
            render: (data: any, type: any, full: any) => {
              if (data) {
                console.log(data)
                return  `${formatDate(data, 'h:mm:ss a', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: true,
             //sortData: 'createdDate'
         
          }, 
          {
            title: 'Active duration',
            data: "activeDuration",
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
             //sortData: 'createdDate'
         
          },

        ],
        responsive: false,
        showActionMenu: true,
        showEditIcon:false,
        showDeleteIcon: false,
        // actionMenuItems: [],

       
        exportClicked: () => {
          this.service.initiateDealerLoggedExportExcel(this.ExecelSerchBody,this.ExecelFilterBody).then((res: any) => {
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
              
              if(field === 'activateFlag'){
                requestBody[field] = value;
              }
              if (field === 'dealerReport') {
                requestBody['dealerId'] = value[0].id;
                requestBody['dealerName'] = value[0].name;
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
          const res = await this.service
          
         //const res = "";
           .getAllDealerLog(params,requestBody);
      //.getAllData(10,10);
          if (!res || !res.data || !res.data.content) {
            //if (!res || !res.data) {
            return {
              totalRecords: 0,
              data: [],
            };
          }
          const viewModels = await Promise.all(res.data?.content.map((x: any) => CategoryCountReportModelMapper.mapToViewModel(x)));
          //const viewModels = res.data;
          //console.log(viewModels)
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
  }

  downloadTemplate() {
    const url = this.service.getTemplateDealerLoggedDownloadUrl();
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");

    DownloadUtil.downloadFile(this.http, url, 'dealerloggedIineport.xlsx' , 'dealer_loggedIn',this.ExecelSerchBody,this.ExecelFilterBody);
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
  onCloseUploadModal(e: any) {
    this.showUploadModal = false;
    this.dataTable.redrawGrid();
  }

}
