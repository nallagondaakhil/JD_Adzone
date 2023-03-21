import { Options } from '@angular-slider/ngx-slider';
export interface DataTableModel {
    options: DataTableOptions;
    onRawClick?: (rawData: any) => void;
    loadData?: (params: DataLoadParams, settings: any) => Promise<{data: any[], totalRecords: number}>;
    customClass?: string;
}

export interface DataTableOptions {
    processing?: boolean;
    serverSide?: boolean;
    columns?: ColumnSettings[];
    responsive?: boolean;
    showActionMenu?: boolean;
    actionMenuItems?: ActionMenuItem[];
    exportExcel?: boolean;
    exportClicked?: () => void;
    showSerialNo?: boolean;
    customRowClass?: (rowData: any) => string;
    hideSearchBar?: boolean;
    searchPlaceHolder?: string;
    showFilter?: boolean;
    filters?: FilterSettings[];
    fixedColumnsTo?: number;
    fixedColumnsLast?:number;
    showEditIcon?:boolean;
    showDeleteIcon?:boolean;
    showViewIcon?:boolean;
}

export interface ColumnSettings {
    data?: string;
    sortData?: string;
    title?: string;
    orderable?: boolean;
    className?: string;
    render?: number | string | DataTables.ObjectColumnData | DataTables.FunctionColumnRender | DataTables.ObjectColumnRender;
    onClick?: (rawData: any, event: any) => void;
    clickableElementClas?: string;
}

export interface DataLoadParams {
    page: number;
    size: number;
    sortBy?: string;
    sort?: 'asc' | 'desc';
    filters?: Map<string,any>;
    searchKey?: string;
    tabIndex?: number;
}

export interface ActionMenuItem {
    label: string;
    icon?: string;
    clickableClass?:string;
    click: (rawData: any) => void;
    hide?: (rawData: any) => boolean;
}

export interface FilterSettings {
    field: string;
    type: 'select' | 'multiSelect' | 'dateRange' | 'date' | 'country' | 'zones' | 'states' | 'areaOffices' | 'status'| 'slider'| 'viceVersaCountry' | 'viceVersaZones' | 'viceVersaStates' | 'viceVersaAreaOffices'|'statesByAreaOffice'|'areaOfficesSingleSelect'| 'district' | 'village'|'teshil' | 'region' |'sub-region' |'division' |'category' |'sub-category' |'category2' | 'market'| 'roles' | 'statusOrder' | 'filetype'| 'year'|'dealer'|'supplier'| 'orderType'|'marketnew'|'dealerReport'|'approval';
    placeholder?: string;
    fieldid?:string;
    selectOptions?: Array <SelectOptions>;
    value?: any; //user selected value
    maxDate?: Date;
    minDate?: Date;
    minValue?: number;
    maxValue?: number;
    sliderOption?: Options ;
}

export interface SelectOptions {
    id: any;
    name: String;
}
