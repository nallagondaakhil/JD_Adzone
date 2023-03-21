import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActionMenuItem, DataLoadParams, DataTableModel, DataTableOptions, FilterSettings, SelectOptions } from './models/data-table-model';

type AjaxRequestOptions = {
  columns: any[], draw: number, length: number,
  order: {column: number, dir?: 'asc' | 'desc'}[], search: {value: string}, start: number
};
@Component({
  selector: 'jd-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  model: DataTableModel;

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  @ViewChild('actionMenu') actionMenu: ElementRef;
  @ViewChild('txtSearch') txtSearch: ElementRef;
  @ViewChild('filterButton') filterButton: ElementRef;
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('tableScroll') tableScroll: ElementRef;
  
  showSearchPlaceHolder:boolean=false;
  noData :boolean = false;
  dtOptions: DataTables.Settings;
  cellClickEvents: {identifier: string, click: (rawData: any, event: any) => any}[] = [];
  searchKey = '';
  currentPage = 1;
  pageSize = 10;
  rowClickable = false;
  hideSearchBar = false;
  filters: Map<string,any> = new Map();

  // action menu
  actionMenus: ActionMenuItem[] = [];
  showActionMenu = false;
  exportExcel = false;
  showFilter = false;
  actionMenuTop = 0;
  actionMenuLeft = 0;
  actionMenuContext: any;
  showFilterDialog = false;
  filterDialogTop = 0;
  filterDialogRight = 0;
  filterDialogWidth = 0;
  filterApplied: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initOptions();
   
    // todo uncomment when releasing to production
    //$.fn['dataTable'].ext.errMode = 'none';
  }

 
  initOptions() {
    
    this.exportExcel = this.model.options.exportExcel;
    this.showFilter = this.model.options.showFilter;
    this.hideSearchBar = this.model.options.hideSearchBar;
    this.dtOptions = this.mapToDataTableOptions(this.model.options);
    this.dtOptions.rowCallback = (row: Node, data: any[] | object, index: number) => {
      if (this.model.options.customRowClass) {
        const className = this.model.options.customRowClass(data);
        if (className) { $(row).addClass(className); }
      }
      if (this.model.options.showSerialNo) {
        const siNo = (this.currentPage - 1) * this.pageSize + (index + 1);
        $('td:first', row).html((siNo).toString());
      }
      if (this.model.onRawClick) {
        this.rowClickable = true;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.model.onRawClick(data);
        });
      }
      if (this.cellClickEvents.length) {
        this.cellClickEvents.forEach(x => {
          const selector = `td .${x.identifier}`;
          $(selector, row).off('click');
          $(selector, row).on('click', (event) => {
            event.stopPropagation();
            x.click(data, event);
          });
        });
      }
      return row;
    };
    if (this.model.loadData) {

      this.dtOptions.ajax = (data: any, callback, settings) => {
        const params: AjaxRequestOptions = data;
        const page = this.currentPage = (params.start / params.length) + 1;
        const size = params.length;
        const sortIndex = params.order && params.order[0]?.column;
        let sortBy = sortIndex == null ? undefined : params.columns[sortIndex].data;
        const customSort = this.model.options.columns.find(x => x.data === sortBy);
        sortBy = customSort?.sortData || sortBy;
        const sort = params.order && params.order[0]?.dir || 'desc';
        const draw = params.draw;
        const searchKey = this.searchKey;
        const filters = this.filters;
        this.model.loadData({page, size, sortBy, sort, searchKey , filters}, settings).then(res => {
          this.showSearchPlaceHolder = searchKey && !res?.data?.length;
          if(res?.data?.length == 0){
          this.noData = true;
          }else{
            this.noData = false;
          }
          callback({
            draw,
            recordsTotal: res.totalRecords,
            recordsFiltered: res.totalRecords,
            data: res.data
          });
        });
      };
    }
  }

  mapToDataTableOptions(options: DataTableOptions) {
    this.cellClickEvents = [];
    const result: DataTables.Settings = {
      processing: options.processing,
      serverSide: options.serverSide,
      columns: options.columns.map(col => {
        if (col.onClick && col.clickableElementClas) {
          this.cellClickEvents.push({click: col.onClick, identifier: col.clickableElementClas});
        }
        return {
          data: col.data,
          title: col.title,
          render: col.render,
          orderable: col.orderable,
          className: col.className
        };
      }),
      responsive: options.responsive,
      lengthChange: false,
      pageLength: 10,
      info: false,
      searching: false,
      order: [],
      language: {
        search: ''
      },

    };
    if (options.showActionMenu && options.actionMenuItems) {
      this.actionMenus = options.actionMenuItems;
      this.actionMenus.forEach(element => {
        result.columns.push({
          title: element.label,
          orderable: false,
          className: 'text-center',
          data: '',
          render: (data: any, type: any, full: any) => {
            return element.icon;
          },
        });
        this.cellClickEvents.push({click: element?.click, identifier: element.clickableClass});
      });
      
      
    }
    if (options.showEditIcon) {
      result.columns.push({
        title: '',
        orderable: false,
        className: 'text-center',
        data: '',
        render: (data: any, type: any, full: any) => {
          return `<span class="uxf-icon dt-edit-menu">
          <svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
          </span>`;
        },
      });
      this.cellClickEvents.push({click: this.onActionMenuClick.bind(this), identifier: 'dt-edit-menu'});
    }
    if (options.showDeleteIcon) {
      
      result.columns.push({
        title: '',
        orderable: false,
        className: 'text-center',
        data: '',
        render: (data: any, type: any, full: any) => {
          return `<svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>`;
        },
      });
      this.cellClickEvents.push({click: this.onActionMenuClick.bind(this), identifier: 'dt-action-menu'});
    }
    if (options.showViewIcon) {
      result.columns.push({
        title: '',
        orderable: false,
        className: 'text-center',
        data: '',
        render: (data: any, type: any, full: any) => {
          return `<span class="uxf-icon dt-view-menu">
          <svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
          </span>`;
        },
      });
      this.cellClickEvents.push({click: this.onActionMenuClick.bind(this), identifier: 'dt-view-menu'});
    }

    if (options.showSerialNo) {
      result.columns.unshift({
        title: 'S.No',
        orderable: false,
        data: '',
        render: (data: any, type: any, full: any) => ''
      });
    }
    return result;
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var tableCol = document.querySelector('.dataTables_wrapper > div:nth-child(2) > div');
      tableCol ? tableCol.classList.add('table-responsive') : null;
      this.setFixedColumns();
      dtInstance.columns().every((col) => {
      });
      dtInstance.on('draw.dt', () => this.setFixedColumns());
    });
    try{
      document.getElementsByClassName('table-responsive')[0].scrollLeft= document.getElementsByClassName('table-responsive')[0].scrollWidth;
    }
    catch
    {

    }
    try{
      setTimeout(function(){
        document.getElementsByClassName('table-responsive')[0].scrollLeft= document.getElementsByClassName('table-responsive')[0]?.scrollWidth;
      },2000)
    }
    catch(e)
    {

    }
 
    
  }

  setFixedColumns() {
    if(this.model.options.fixedColumnsTo) {
        var ths = document.querySelectorAll(`.dataTables_wrapper table th:nth-child(-n+${this.model.options.fixedColumnsTo})`);
        var tds = document.querySelectorAll(`.dataTables_wrapper table tbody tr td:nth-child(-n+${this.model.options.fixedColumnsTo})`);
        ths.forEach((th, i) => {
          var width;
          if(i==0){
            width =  i > 0 ? ths[i -1].getBoundingClientRect().width - 15   : null;
          }else if(i==1){
            width =  i > 0 ? ths[i -1].getBoundingClientRect().width -20: null;
          }
          else{
            width =  i > 0 ? ths[i -1].getBoundingClientRect().width -20 : null;
          }
         
          th.classList.add('fixed-column');
          (th as HTMLElement).style.left = width ? `${width.toString()}px` : null;
        });
        tds.forEach((td, i) => {
          var width;
          if(i==0){
            width =  i > 0 ? tds[i -1].getBoundingClientRect().width - 15 : null;
          }
          else if(i==1){
            width =  i > 0 ? tds[i -1].getBoundingClientRect().width -20: null;
          }else{
            width =  i > 0 ? tds[i -1].getBoundingClientRect().width -20: null;
          }
          td.classList.add('fixed-column');
          if (width && i%this.model.options.fixedColumnsTo !== 0 && td.getBoundingClientRect().width !== tds[i - 1].getBoundingClientRect().width) {
            (td as HTMLElement).style.left = `${width.toString()}px`;
          }
        });
    }

   

    if(this.model.options.fixedColumnsLast){
      const actionButTh1=document.querySelectorAll(`.dataTables_wrapper table th:nth-last-child(1)`);
      actionButTh1.forEach((th, i) => {
  
        th.classList.add('fixed-column');
        (th as HTMLElement).style.right =  `-15px`;
      });
      var actionButTd1 = document.querySelectorAll(`.dataTables_wrapper table tbody tr td:nth-last-child(1)`);
      actionButTd1.forEach((td, i) => {
        let  width:any = -15;
        td.classList.add('fixed-column');
        (td as HTMLElement).style.right = `${width.toString()}px`;
  
      });
      
      const actionButTh=document.querySelectorAll(`.dataTables_wrapper table th:nth-last-child(2)`);
      actionButTh.forEach((th, i) => {
  
        th.classList.add('fixed-column');
        (th as HTMLElement).style.right =  `17px`;
      });
      var actionButTd = document.querySelectorAll(`.dataTables_wrapper table tbody tr td:nth-last-child(2)`);
      actionButTd.forEach((td, i) => {
        let  width:any = 17;
        td.classList.add('fixed-column');
        (td as HTMLElement).style.right = `${width.toString()}px`;
  
      });
    }
    

    // const actionButTh=document.querySelectorAll(`.dataTables_wrapper table th:nth-last-child(1)`);
    // actionButTh.forEach((th, i) => {
   
    //   th.classList.add('fixed-column');
    //   (th as HTMLElement).style.right =  `-15px`;  
    // });
    // var actionButTd = document.querySelectorAll(`.dataTables_wrapper table tbody tr td:nth-last-child(1)`);
    // actionButTd.forEach((td, i) => {
    //   let  width:any = -15;
    //   td.classList.add('fixed-column');
    //   (td as HTMLElement).style.right = `${width.toString()}px`;
    
    // });
  }

  redrawGrid() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw(false);
    });
  }
  redrawGridSearch() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw(true);
    });
  }

  onSearchChange(val: string) {
    this.redrawGridSearch();
  }

  onSearchClick(val: string) {
    this.searchKey = val;
    this.onSearchChange(val);
  }

  onClearSearch(val: string) {
    this.searchKey = '';
    this.onSearchChange('');
    this.cdr.detectChanges();
    if(this.txtSearch!=undefined)
      (this.txtSearch.nativeElement as HTMLInputElement).value = '';
  }

  onSearchKeyup(v: string) {
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.showActionMenu = false;
  }

  onActionMenuClick(rawData: any, event: MouseEvent) {
    this.showActionMenu = true;
    this.actionMenuTop = event.clientY;
    this.actionMenuLeft = event.clientX - 8;
    this.actionMenuContext = rawData;
  }

  onActionMenuItemClick(menu: ActionMenuItem) {
    this.showActionMenu = false;
    menu.click(this.actionMenuContext);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }

  onExportClick() {
    if (this.model.options?.exportClicked) {
      this.model.options.exportClicked();
    }
  }

  getActionMenuStatus(menu: ActionMenuItem) {
    if (menu.hide) {
      return menu.hide(this.actionMenuContext);
    }
    return false;
  }



  onFilterClick(){
    this.filterDialogTop = (this.filterButton.nativeElement.offsetTop + this.filterButton.nativeElement.offsetHeight);
    let filterDialogOffsetRight = (this.filterButton.nativeElement.offsetLeft + this.filterButton.nativeElement.offsetWidth);
    this.filterDialogRight = window.innerWidth - filterDialogOffsetRight;
    this.filterDialogWidth = filterDialogOffsetRight - this.searchBox.nativeElement.offsetLeft;
    this.showFilterDialog = !this.showFilterDialog;
  }

  onCloseFilter(filterOutside: boolean = false){
    if(!filterOutside){
      // this.showFilterDialog = !this.showFilterDialog;
      this.showFilterDialog = false;
    }

    this.filters = new Map();
    this.redrawGrid();
    this.cdr.detectChanges();
    this.filterApplied = false;
  }

  onFilterCallback(options:FilterSettings[]){
    this.model.options.filters = options;
    this.cdr.detectChanges();
    let filterMap: Map<string,any> = new Map();
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
          case 'category':
          case 'dealer':
          case 'approval':
          // case 'marketnew':
          case 'filetype':
            case 'year':
            case 'statusOrder':
              case 'dealerReport':
            case 'orderType':
            case 'sub-category':
            let selectOptions: SelectOptions[] = filter.value;
            filterMap.set(filter.field, selectOptions.map((selectedOption)=> selectedOption));
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
            filterMap.set(filter.field, filter.value);
            break;
          case 'slider':
            filterMap.set(filter.field, filter.value);
            break;
          default:
            break;
        }
      }
    });
    this.filters = filterMap;
    this.redrawGridSearch();
    this.cdr.detectChanges();
    this.showFilterDialog = false;
  }

  onFilterUpdated(value: boolean){
    this.filterApplied = value;
  }
}
