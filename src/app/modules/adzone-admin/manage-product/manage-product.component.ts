import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings, SelectOptions } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { ManageProductService } from '../services/manage-product.service';
import { ManageProductModelMapper, ManageProductView } from './models/manage-product-view.model';

@Component({
  selector: 'jd-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  @Input() model: ManageProductView;
  config={id:'test', itemsPerPage: 10, currentPage: 1,totalItems:10 }
  dataTableModel: DataTableModel;
  params: DataLoadParams={page: 1,size: 10, };
  requestBody:any;
  @Output() closed = new EventEmitter();
  productModel : ManageProductView[] = [];
  searchClicked =false;
  showFilterDialog = false;
  filterDialogTop = 0;
  filterDialogRight = 0;
  ExecelFilterBody: DataLoadParams;
  ExecelSerchBody = {};
  filterDialogWidth = 0;
  filterApplied: boolean = false;
  filters: Map<string,any> = new Map();
  loading = false;
  page = 1;
  excelBody: any = {};
  showEditProduct = false;
  selectedModel: ManageProductView[]=[];
  showAddModal = false;
  productSearch:any;
  racfId:any;
  result:any;
  @ViewChild('filterButton') filterButton: ElementRef;
  @ViewChild('dataTable') dataTable: DataTableComponent;
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('txtSearch') txtSearch: ElementRef;
  constructor(private cdr: ChangeDetectorRef,private service: ManageProductService,
    private modalService: ModalDialogService,private productservice: ManageProductService,
    private alertService: AlertsService,private router:Router,private http:HttpClient,private userService:UserService,) { }

  ngOnInit(): void {
    
    this.model = this.model || {} as any;
    this.model.productSearch = this.model?.productSearch || null; 
    this.racfId = this.userService.getRacfId();
    this.managePayLoad(this.model)
    this.initDataTable();
  }
  getMasterData(filter:string){
    let options: SelectOptions[] = [];
    switch(filter){
      case 'regions':
        this.productservice.getRegion().then(regions=>{
          regions.forEach(region=>{
            options.push(region);
          });
        });
        break;
        case 'category':
        this.productservice.getDocCategory().then(categories=>{
          categories.forEach(category=>{
            options.push(category);
          });
        });
        break;
     
      //  case 'subregions':
      //   var regionIds: {regionId: number}[] = []
      //   this.regionIds?.forEach(x => {
      //     this.regionIds.push({regionId:x?.id});
      //   });
      //    this.usermanagementservice.getSubRegion(regionIds, true).then(subRegionId=>{
      //     subRegionId.forEach(subRegionIds=>{
      //       options.push(subRegionIds);
      //     });
      //   });
      //   break;
     
      // case 'countries':
      //   this.masterDataService.getCountrys().then(Countries=>{
      //     Countries.forEach(country=>{
      //       options.push(country);
      //     });
      //   });
      //   break;
      
      // case 'zones':
      //   this.masterDataService.getZones().then(zones=>{
      //     zones.forEach(zone=>{
      //       options.push(zone);
      //     });
      //   });
      //   break;
      // case 'branches':
      //   this.masterDataService.getBranches().then(branches=>{
      //     branches.forEach(branch=>{
      //       options.push(branch);
      //     });
      //   });
      //   break;
      // case 'states':
      //   this.masterDataService.getStates().then(states=>{
      //     states.forEach(state=>{
      //       options.push(state);
      //     });
      //   });
      //   break;
      // case 'areaOffices':
      //   this.masterDataService.getAreas().then(areas=>{
      //     areas.forEach(area=>{
      //       options.push(area);
      //     });
      //   });
      //   break;
      // // case 'roles':
      // //   this.roleService.getActiveRoles().then(roles =>{
      // //     roles.forEach(role =>{
      // //       options.push(role);
      // //     })
      // //   })
      //   break;
      // default:
      //   break;
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
        searchPlaceHolder:'Search For Document Name',
        filters:[  {
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
        // {
        //   field: 'activeFlag',
        //   type: 'status',
        // },    
      ],
     
      
      columns: [],
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
    
    loadData: async (params: DataLoadParams, settings) => {
      try {
        let requestBody: any = {};
        if(params.filters != undefined){
          params.filters.forEach((value, field)=>{
            if(field === 'activeFlag'){
              // requestBody[field] = value ? "Active" : "Inactive";
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
        .getAll(params,requestBody);
        if (!res || !res.data || !res.data.content) {
          return {
            totalRecords: 0,
            data: [],
          };
        }
        const viewModels = await Promise.all(res.data?.content.map((x: any) => ManageProductModelMapper.mapToViewModel(x,null)));
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
  }
}

  async managePayLoad(listItem:any)
  {
    const res = await this.service.getsearch(this.model);
    if(res.data != null){
      this.config.totalItems=res.data.totalElements;
    this.productModel = await Promise.all(res.data?.content.map((x: any) => ManageProductModelMapper.mapToViewModel(x,null)));
    }else{
      this.productModel = res.data;
    }
    this.handlePageChange(1);
    
  }
  onFilterClick(){
    this.filterDialogTop = (this.filterButton.nativeElement.offsetTop + this.filterButton.nativeElement.offsetHeight);
    let filterDialogOffsetRight = (this.filterButton.nativeElement.offsetLeft + this.filterButton.nativeElement.offsetWidth);
    this.filterDialogRight = window.innerWidth - filterDialogOffsetRight;
    this.filterDialogWidth = filterDialogOffsetRight - this.filterButton.nativeElement.offsetLeft;
    this.showFilterDialog = !this.showFilterDialog;
    this.cdr.detectChanges();
  }
  async onFilterCallback(options:FilterSettings[]){
    // console.log(this.dataTable);
    //this.dataTable.onFilterCallback(options);
    //this.showFilterDialog = !this.showFilterDialog;
    //this.model.options.filters = options;
    let filterMap: Map<string,any> = new Map();
    let filterfield=[] as any;
    let filterobject={} as any;
    options.forEach(filter =>{
      if(filter.value != null){
        switch(filter.type){
          case 'multiSelect':
          case 'statesByAreaOffice':
          case   'areaOfficesSingleSelect':
          case 'zones':
          case 'states':
          case  'district': 
          case 'village':
          case 'teshil':
          case 'areaOffices':
          case 'viceVersaZones':
          case 'viceVersaStates':
          case 'viceVersaAreaOffices':
          case 'region':
          case 'sub-region':
          case 'division':
          case 'market':
          case 'roles':
            let selectOptions: SelectOptions[] = filter.value;
            //filterobject.filter.field;
            
            //console.log(filterobject);
            filterfield.push({[filter.field]:selectOptions})
            filterobject[filter.field] = selectOptions;
            //filterMap.set(filter.field, selectOptions)
            //console.log(filterfield);
              //console.log(filter.field.push(selectOptions))
            //filterMap.set(filter.field, selectOptions);
            //console.log(filterMap.set(filter.field, selectOptions.map((selectedOption)=> selectedOption)))
            break;
          case 'select':
         
          case 'status':
          case 'country':
          case 'viceVersaCountry':
            let selectOption: SelectOptions = filter.value[0];
            if(selectOption)
              filterMap.set(filter.field, selectOption.id);
            break;
          case 'date':
            filterMap.set(filter.field, filter.value[0]);
            break;
          case 'dateRange':
            //filterMap.set(filter.field, filter.value);
            //filterfield.push({[filter.field]:filter.value})
            filterobject["fromDate"]=filter.value[0];
            filterobject["toDate"]=filter.value[1];
            //filterobject[filter.field] = filter.value;
            break;
          case 'slider':
            filterMap.set(filter.field, filter.value);
            break;
          default:
            break;
        }
      }
    });
    //this.filters = filterfield[0];
    this.ExecelFilterBody = filterobject;
    const res = await this.service.getAll(null,filterobject);
    if(res.data != null){
      this.config.totalItems=res.data.totalElements;
      this.productModel = await Promise.all(res.data?.content.map((x: any) => ManageProductModelMapper.mapToViewModel(x,null)));
      }else{
        this.productModel = res.data;
      }
    
    //this.redrawGrid();
    this.cdr.detectChanges();
    this.showFilterDialog = false;
  }
  
  onFilterUpdated(value: boolean){
    
    this.filterApplied = value;
  }
  addProduct() {
      this.showAddModal = true;
      this.selectedModel = null;
  }
  onDelete(documentId:number) {
    this.modalService.show({
      title: 'Delete Document Name',
      message: `Are you sure you want to delete this Product Name?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
      try {
        let result: ApiResponse<ManageProductView>;
          result = await this.productservice.delete(documentId);
        if (ApiErrorUtil.isError(result)) {
          this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
        } else {
          this.alertService.show(result?.message?.messageDescription );
        }
      } catch (error) {
          this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete Product Name', AlertType.Critical);
      }
      this.loading = false;
      this.modalService.publisher.next(null);
      this.reloadComponent();
      //this.dataTable.redrawGrid();
      },
      cancelText: 'No',
      cancelCallback: () => {
        this.modalService.publisher.next(null);
      },
      modalType: ModalType.warning,
      isSecondModal: true
    });
}
async onEdit(documentId:any)
{
  
  const res=await this.productservice.editDocument(documentId);
  this.selectedModel= await Promise.all(res.data?.content.map((x: any) => ManageProductModelMapper.mapToViewModel(x,null)));
  //this.selectedModel =await result[0];
  //this.childToParent.emit(selectedModel);
  setTimeout(() => {this.showAddModal = true;}, 100);
}
  async onCloseFilter(){
  this.showFilterDialog = false;
  //this.dataTable.onCloseFilter();
  this.ExecelFilterBody=null;
  this.filterApplied = false;
  const res = await this.service.getAll(null,null);
    if(res.data != null){
      this.config.totalItems=res.data.totalElements;
      //console.log(this.config.totalItems)
      this.productModel = await Promise.all(res.data?.content.map((x: any) => ManageProductModelMapper.mapToViewModel(x,null)));
      }else{
        this.productModel = res.data;
      }
}
reloadComponent() {
  let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
  }
  onCloseAddModal(e:any){
    this.showAddModal = false;
   
    //this.dataTable.redrawGrid();
  }
  onSearchChange(val: string) {
    //this.dataTable.onSearchChange(val)
  }

  async onSearchClick(val: string) {
    this.model.productSearch = val;
    this.ExecelSerchBody=val;
    this.managePayLoad(this.model);
  }

  onClearSearch(val: string) {
    this.model.productSearch = null;
    this.ExecelSerchBody={};

    this.managePayLoad(null);
    (this.txtSearch.nativeElement as HTMLInputElement).value = '';
   
  }
  handlePageChange(event) {
    this.page = event;
  }
  onSearchKeyup(val: string){

  }
  downloadTemplate() {
    const url = this.productservice.getTemplateDownloadUrl(this.racfId);
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    if(Object.keys(this.ExecelSerchBody).length !=0){
      
      this.ExecelSerchBody = {searchKey:this.ExecelSerchBody}
    }
   
    DownloadUtil.downloadFile(this.http, url, 'printablematerial.xlsx' , 'printable-material',this.ExecelSerchBody,this.ExecelFilterBody);
    
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
  async pageChanged(event:any)
  {
    this.params.page=event;
    this.config.currentPage=event;
    const res = await this.service
    .getAll(this.params,this.requestBody);
    if (!res || !res.data || !res.data.content) {
      
    }
    else
    {
      this.config.totalItems=res.data.totalElements;
      const viewModels = await Promise.all(res?.data?.content.map((x: any) => ManageProductModelMapper.mapToViewModel(x,null)));
      //console.log(viewModels);
      this.productModel=viewModels;
      
    }
  }
}
