import { DatePipe, formatDate, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataLoadParams, DataTableModel, FilterSettings, SelectOptions } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { MockDataService } from '../../showcase/mock-data.service';
import { DocumentTypeService } from '../services/doc-type.service';
import { DocTypeModelMapper, DocumentTypeView } from './models/doc-type-view.model';
import { RolePermissionService } from '../services/role-permission.service';

@Component({
  selector: 'jd-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss']
})

export class DocumentTypeComponent implements OnInit {

  previewDoc = false;
  documentTab = true;
  @Input() documentValues: any;
  showAddModal = false;
  iscompanyEdit = false;
  dataTableModel: DataTableModel;
  showUploadModal = false;
  ExecelFilterBody: DataLoadParams ;
  ExecelSerchBody = {};
  @Output() closed = new EventEmitter();
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
  regionIds:any;
  racfId:any;
  showEditDoc = false;
  selectedModel: DocumentTypeView;
  @Input() model: DocumentTypeView;
  permissionView:any;
  permissionAdd:any;
  permissionEdit:any;
  permissionActivate:any;
  permissionDeactivate:any;
  permissionDelete:any;
  actionItem:any = [];
  showTableData =  false;
  user = this.userService.getUserRoleId();
  approvalOptions: any[]=[];
  approvalStatus: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef ,    
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private mockData: MockDataService,
    private docService: DocumentTypeService,
    private http: HttpClient,
    private userService:UserService,
    private rolepermission:RolePermissionService,
    private titlecasePipe: TitleCasePipe,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.checkPermission().then(x => {
      this.initDataTable();
      
    });
    this.racfId = this.userService.getRacfId();
    
  }
  async checkPermission(){
    await this.rolepermission.getPermissionForModule(this.user,"Documents");
    this.permissionView = await this.rolepermission.getRoleById("view_doc");
    this.permissionAdd = await this.rolepermission.getRoleById("create_doc");
    this.permissionEdit = await this.rolepermission.getRoleById("edit_doc");
    this.permissionActivate = await this.rolepermission.getRoleById("activate_doc");
    this.permissionDeactivate = await this.rolepermission.getRoleById("deactivate_doc");
    this.permissionDelete = await this.rolepermission.getRoleById("delete_doc");
  }
  getMasterData(filter:string){
    let options: SelectOptions[] = [];
    switch(filter){
      case 'regions':
        this.docService.getRegion().then(regions=>{
          regions.forEach(region=>{
            options.push(region);
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
        case 'approval':
        this.docService.getApprovalAll().then(categories=>{

          categories.forEach(category=>{
            options.push(category);
          });
          console.log('category',categories)
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
        fixedColumnsTo:2,
        fixedColumnsLast:1,
        searchPlaceHolder:'Search For Category,Sub-Category,File Name,Document ID',
        filters:[
          // {
          //   field: 'categoryIds',
          //   type: 'category',
          //   placeholder: 'Category',
          //   selectOptions: this.getMasterData('category')
          // },
          // {
          //   field: 'subcategoryIds',
          //   type: 'sub-category',
          //   placeholder: 'Sub-Category',
          //   //selectOptions: this.getMasterData('divisions')
          // },
          // {
          //   field: 'category2Ids',
          //   type: 'category2',
          //   placeholder: 'Category2',
          //   //selectOptions: this.getMasterData('divisions')
          // },
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
          {
            field: 'activeFlag',
            type: 'status',
          },    
          {
            field: 'documentCategoryId',
            type: 'category',
            placeholder: 'Category',
            selectOptions: this.getMasterData('category')
          },    
          // {
          //   field: 'publishStatus',
          //   type: 'approval',
          //   placeholder: 'Approval Status',
          //   selectOptions: this.getMasterData('approval')
          // },    
        ],
        columns: [
          {
            title: '',
            data: '',
            render: (data: any, type: any, full: any) => {
              return `<span class="svgIcon" style="cursor:pointer;"><svg class="pluse" focusable="false" aria-hidden="true" fill="#666666"
             xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24" width="24" height="24">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z">
              </path><path fill="none" d="M0 0h24v24H0V0z"></path>
            </svg></span>`;
            },
            onClick: (rawData: any, event: any) => {
              console.log(rawData,'rawData')
              if(rawData.uploadedDocs.length == 0){
                this.alertService.show("No Files", AlertType.Critical);
              }
                if ($(event.target).hasClass("active") == false && rawData.uploadedDocs.length > 0) {
                  $(event.target).addClass("active")
                  var table = $('.dataTable').DataTable();
                  var tr = $(event.target).parents('tr');
                  var row = table.row(tr);
                  let innertable = '';
                  rawData.uploadedDocs.forEach((element: any, index: number) => {
                    // console.log("elements",element)
                    if(element?.inSearch == true){
                      if (element?.fileName)
                        element.fileName = this.titlecasePipe.transform(element?.fileName)
                        element.createdDateFormat = this.datePipe.transform(element.createdDate, 'dd-MM-yyyy h:mm:ss a', 'en-US');
                        innertable = innertable + '<tr class="child-border" style="border: 1px solid #ddd;"><td max-width="50%"><div style="text-overflow:ellipsis;overflow: hidden; font-weight:bold;color:#367c2b;" title="' + element?.fileName + '">' + element?.fileName + '</div></td><td><div style="text-overflow:ellipsis;overflow: hidden;display: flex;justify-content: end;" title="' + element?.createdBy + '">' + element?.createdBy + '</div></td><td><div style="text-overflow:ellipsis;overflow: hidden;margin-left: 0.5rem !important;" title="' + element?.createdDateFormat + '">' + element?.createdDateFormat + '</div></td><tr>'
                    }else{
                      if (element?.fileName)
                     
                        element.fileName = this.titlecasePipe.transform(element?.fileName)
                        element.createdDateFormat = this.datePipe.transform(element.createdDate, 'dd-MM-yyyy h:mm:ss a', 'en-US');
                        innertable = innertable + '<tr class="child-border" style="border: 1px solid #ddd;"><td max-width="50%"><div style="text-overflow:ellipsis;overflow: hidden;" title="' + element?.fileName + '">' + element?.fileName + '</div></td><td><div style="text-overflow:ellipsis;overflow: hidden;display: flex;justify-content: end;" title="' + element?.createdBy + '">' + element?.createdBy + '</div></td><td><div style="text-overflow:ellipsis;overflow: hidden;margin-left: 0.5rem !important;" title="' + element?.createdDateFormat + '">' + element?.createdDateFormat + '</div></td><tr>'
                        //innertable = innertable + '<tr class="child-border" style="border: 1px solid #ddd;"><td style="width:58.4% !important;"><div style="text-overflow:ellipsis;overflow: hidden;" title="' + element?.fileName + '">' + element?.fileName + '</div></td><td style="width: 6% !important;"><div style="text-overflow:ellipsis;overflow: hidden;display: flex;justify-content: end;" title="' + element?.createdBy + '">' + element?.createdBy + '</div></td><td><div style="text-overflow:ellipsis;overflow: hidden;margin-left: 0.5rem !important;" title="' + element?.createdDateFormat + '">' + element?.createdDateFormat + '</div></td><tr>'
                  }});
                    if (rawData.uploadedDocs.length > 0) {
                    row.child(`<div id="table-scroll"><table class="table table-striped" style="width:100%;table-layout:fixed;">${innertable}</table></div>`).show();
                    tr.addClass('shown');
                  }
                  return '';
                }
                else {
                  $(event.target).removeClass("active");
                  var table = $('.dataTable').DataTable();
                  var tr = $(event.target).parents('tr');
                  var row = table.row(tr);
                  row.child().hide();
                }
              },
            clickableElementClas: 'pluse',
            orderable: false,
          },
          {
            title: 'Document ID',
            data: 'documentId',
            render: (data: any, type: any, full: any) => {
              if (data ) {
        
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
          },
          {
            title: 'Document Count',
            data: 'documentCount',
            render: (data: any, type: any, full: any) => {
              if (data ) {
        
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
          },
          // {
          //   title: 'Document Name',
          //   data: 'documentName',
          //   render: (data: any, type: any, full: any) => {
          //     if (data) {
          //       return  `<span title= "${data}"> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          //   orderable: true,
          //   sortData: 'documentName'
          // },
          {
            title: 'Document Category',
            data: 'documentCategoryId',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data[0]?.name}"> ${data[0]?.name}  </span>`
              }
              return '-';
            },
            orderable: true,
            sortData:'documentCategoryName'
          },
          {
            title: 'Document Sub-Category',
            data: 'documentSubCategoryId',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data[0]?.name}"> ${data[0]?.name}  </span>`
              }
              return '-';
            },
            orderable: true,
            sortData: 'documentSubCategoryName',
          },
          {
            title: 'Category 2',
            data: 'documentSubChildCategoryId',
            render: (data: any, type: any, full: any) => {
              if (data && data[0]?.name) {
                return  `<span title= "${data[0]?.name}"> ${data[0]?.name}  </span>`
              }
              return '-';
            },
            orderable: true,
            sortData: 'documentSubChildCategoryName',
          },
          {
            title: 'Category 3',
            data: 'documentSubChildFourthCategoryId',
            render: (data: any, type: any, full: any) => {
              if (data && data[0]?.name) {
                return  `<span title= "${data[0]?.name}"> ${data[0]?.name}  </span>`
              }
              return '-';
            },
            orderable: true,
            sortData: 'documentSubChildCategoryName',
          },
          {
            title: 'Region',
            data: 'regions',
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
          },
          {
            title: 'Sub Region',
            data: 'subRegions',
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
          },
          {
            title: 'Division',
            data: 'divisions',
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
          },
          {
            title: 'Market',
            data: 'countries',
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
          },
          {
            title: 'Created By',
            data: 'createdBy',
            render: (data: any, type: any, full: any) => {
              if (data) {
                return  `<span title= "${data}"> ${data}  </span>`
              }
              return '-';
            },
            orderable: false,
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
          {
            title: 'Expiry Date',
            data: 'expiryDate',
            render: (data: any, type: any, full: any) => {
              if (data ) {
                return `${formatDate(data, 'dd-MM-yyyy h:mm:ss a', 'en-US')} ` || '-';
              }
              return '-';
            },
            orderable: false,
             //sortData: 'createdDate'
         
          },
          // {
          //   title: 'Approval Status',
          //   data: 'publishStatus',
          //   render: (data: any, type: any, full: any) => {
          //     if (data ) {
          //       return  `<span title= "${data}"> ${data}  </span>`
          //     }
          //     return '-';
          //   },
          //   orderable: false,
          //    //sortData: 'createdDate'
         
          // },
          
          // // {
          // //   title: 'State',
          // //   data: 'first_name',
          // //   render: (data: any, type: any, full: any) => {
          // //     if (data) {
          // //       return  `<span title= "${data}"> ${data}  </span>`
          // //     }
          // //     return '';
          // //   },
          // //   orderable: false,
          // // },
          // // {
          // //   title: 'City',
          // //   data: 'first_name',
          // //   render: (data: any, type: any, full: any) => {
          // //     if (data) {
          // //       return  `<span title= "${data}"> ${data}  </span>`
          // //     }
          // //     return '';
          // //   },
          // //   orderable: false,
          // // },
         
        ],
        responsive: false,
        showActionMenu: true,
        showEditIcon:false,
        showDeleteIcon: false,
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
        // showSerialNo: true
      },
      loadData: async (params: DataLoadParams, settings) => {
        try {
          let requestBody: any = {};
          if(params.filters != undefined){
            console.log('filed',params.filters)
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
          const res = await this.docService
          .getAll(params,requestBody);
          if (!res || !res.data || !res.data.content) {
            console.log('res',res)
            return {
              totalRecords: 0,
              data: [],
            };
          }
         
          const viewModels = await Promise.all(res.data?.content.map((x: any) => DocTypeModelMapper.mapToViewModel(x,null)));
          console.log('hdaufiurs',viewModels)
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
    if(this.permissionEdit)
    {
      console.log(' this.dataTableModel.options', this.dataTableModel)
      
      this.actionItem.push(
        {
          label: 'Action',
          data: 'editable',
          clickableClass: 'dt-edit-menu',
          render: (data: any, type: any, full: any) => {
            console.log('renderdata',data)
          },
          icon: '<span class="uxf-icon dt-edit-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
          click: (rawData: any) => {
            this.showAddModal = true;
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
        icon: '<span class="uxf-icon dt-delete-menu"><svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>',
        click: (rawData: any) => {
          this.onDeleteAction(rawData)
        },
      })
     }
    if(this.permissionEdit)
    {
     this.actionItem.push(
      {
        label: this.permissionEdit ?'':'Action',
        clickableClass: 'dt-preview-images',
        icon: '<span class="uxf-icon dt-preview-images"><img src="/assets/icons/eye.png" title="Preview Docs" class="eye_icon"></span>',
        click: (rawData: any) => {
          console.log("raw data",rawData);
          if (rawData.documentId) {
            this.documentTab = false;
            this.previewDoc = true;
            this.showTableData = false;
            this.documentValues = rawData;
          } else {
            this.alertService.show("No Files", AlertType.Critical);
          }
        },
      })
     }
    if(this.permissionView){
      this.showTableData=true;
    }
  }

  downloadTemplate() {
    const url = this.docService.getTemplateDownloadUrl(this.racfId);
    console.log(this.ExecelSerchBody);
    this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    DownloadUtil.downloadFile(this.http, url, 'documentreport.xlsx' , 'doc_type',this.ExecelSerchBody,this.ExecelFilterBody);
  }

  previewDataTable(){
    console.log("hello");
    this.showAddModal = false;
    this.dataTable.redrawGrid();
    
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
  showConfirmation(status: string, model: DocumentTypeView) {
    this.modalService.show({
      title: status === 'Active' ? 'Activate Document Name' : 'Deactivate Document Name',
      message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this Document Name?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
        try {
          let result: ApiResponse<DocumentTypeView>;
          if (status === 'Active') {
            result = await this.docService.activate(model.documentId);
          } else {
            result = await this.docService.deactivate(model.documentId);
          }
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.alertService.show(result?.message?.messageDescription );
          }
        } catch (error) {
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Document Name', AlertType.Critical);
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
  onDeleteAction(model: DocumentTypeView) {
      this.modalService.show({
        title: 'Delete Document Name',
        message: `Are you sure you want to delete this Document Name?`,
        okText: 'Yes',
        okCallback: async () => {
          this.loading = true;
        try {
          let result: ApiResponse<DocumentTypeView>;
            result = await this.docService.delete(model.documentId);
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.alertService.show(result?.message?.messageDescription );
          }
        } catch (error) {
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to delete Document Name', AlertType.Critical);
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
  addDoc() {
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
    console.log('options',options)
    this.dataTable.onFilterCallback(options);
    this.showFilterDialog = !this.showFilterDialog;
  }

  onFilterUpdated(value: boolean){
    
    this.filterApplied = value;
  }
  onCloseAddModal(e:any){
    this.showAddModal = false;
    this.dataTable.redrawGrid();
    
  }

}
