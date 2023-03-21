import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings, SelectOptions } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { MasterDataService } from '../../admin/services/master-data.service';
import { MockDataService } from '../../showcase/mock-data.service';
import { CategoryCountReportModelMapper } from '../document-category-count/models/document-cat-count-report-view.model';
import { DocumentTypeService } from '../services/doc-type.service';
import { CategoryCountService } from '../services/document-cat-count-report.service';
import { RoleService } from '../services/role-management.service';

@Component({
  selector: 'jd-document-downloaded-report',
  templateUrl: './document-downloaded-report.component.html',
  styleUrls: ['./document-downloaded-report.component.scss']
})
export class DocumentDownloadedReportComponent implements OnInit {

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
  constructor( private mockData: MockDataService, private cdr: ChangeDetectorRef ,private service : CategoryCountService, private roleService:RoleService
    ,private docService:DocumentTypeService,private masterservice:MasterDataService,private alertService:AlertsService,private http:HttpClient) { }

  ngOnInit(): void {
    this.initDataTable();
  }


  getMasterData(filter:string){
    let options: SelectOptions[] = [];
    switch(filter){
      case 'regions':
        // this.usermanagementservice.getRegion().then(regions=>{
        //   regions.forEach(region=>{
        //     options.push(region);
        //   });
        // });
        break;

        case 'roles':
          this.roleService.getRole().then(roleIds=>{
            roleIds.forEach(role=>{
              options.push(role);
            });
          });
          break;
          case 'category':
        this.docService.getDocCategory().then(categories=>{
          categories.forEach(category=>{
            options.push(category);
          });
        });
        break;
        case 'year':
         this.masterservice.getYear().then(years=>{
          years.forEach(year=>{
            options.push(year);
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
        searchPlaceHolder:'Search For Month, Year, RACF ID',
        filters:[
          {
            field: 'roleNames',
            type: 'roles',
            placeholder: 'Role',
            selectOptions: this.getMasterData('roles')
          },
         {
            field: 'category',
            type: 'category',
            placeholder: 'Category',
            selectOptions: this.getMasterData('category')
          },
          {
            field: 'subCategory',
            type: 'sub-category',
            placeholder: 'Sub-Category',
            //selectOptions: this.getMasterData('divisions')
          },
          {
            field: 'years',
            type: 'year',
            placeholder: 'Year',
            selectOptions: this.getMasterData('year')
          },

          // {
          //   field: 'regions',
          //   type: 'region',
          //   placeholder: 'Region',
          //   selectOptions: this.getMasterData('regions')
          // },
          // {
          //   field: 'subRegions',
          //   type: 'sub-region',
          //   placeholder: 'Sub-Region',
          //   //selectOptions: this.getMasterData('subregions')
          // },
          // {
          //   field: 'divisions',
          //   type: 'division',
          //   placeholder: 'Division',
          //   //selectOptions: this.getMasterData('divisions')
          // },
          // {
          //   field: 'markets',
          //   type: 'market',
          //   placeholder: 'Market',
          //   //selectOptions: this.getMasterData('countries')
          // }, 
          // {
          //   field: 'dateRange',
          //   type: 'dateRange',
          //   placeholder: 'Created Date Range',
          //   maxDate: new Date()
          // },
          
        //  {
        //     field: 'dateRangeEffective',
        //     type: 'dateRange',
        //     placeholder: 'Effective Date'
        //   },
          // {
          //   field: 'activateFlag',
          //   type: 'status',
          // },    
        ],
        columns: [
          {
            title: 'Year',
            data: 'year',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Month',
            data: 'month',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Category',
            data: 'categoryName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Sub category',
            data: 'subCategoryName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Documents  downloaded count ',
            data: 'documentDownloadCount',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'RACF ID ',
            data: 'userId',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'User name',
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
            title: 'Role Name',
            data: 'userRole',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
          {
            title: 'Dealer Account ID',
            data: 'dealerAccountId',
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
            data: 'dealerName',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: true,
          },
        ],
        responsive: false,
        showActionMenu: true,
        showEditIcon:false,
        showDeleteIcon: false,
        // actionMenuItems: [],

       
        exportClicked: () => {
          this.service.initiateExportDocumentDownloadExcel(this.ExecelSerchBody,this.ExecelFilterBody).then((res: any) => {
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
          
         // const res = "";
           .getAllDownload(params,requestBody);
          
         // const res = "";
         if (!res || !res.data || !res.data.content) {
          // if (!res || !res.data) {
          return {
            totalRecords: 0,
            data: [],
          };
        }
        const viewModels = await Promise.all(res.data?.content.map((x: any) => CategoryCountReportModelMapper.mapToViewModel(x)));
        // const viewModels = res.data;
        //console.log(viewModels)
        return {
          totalRecords: res.data.totalElements || 0,
          // totalRecords: res.totalRecords || 0,
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
    const url = this.service.getDownloadTemplateDownloadUrl();
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    DownloadUtil.downloadFile(this.http, url, 'documentdownload.xlsx' , 'document_download',this.ExecelSerchBody,this.ExecelFilterBody);
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
