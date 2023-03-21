import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { promise } from 'protractor';
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { MasterDataModel } from "../models/master-data.model";
import { ApiResponse, PagedResponse,PagedRequestOptions, PagedData } from "../models/paged-data.model";
import { MockDataService } from "./mock-data-service";

@Injectable()
export class MasterDataService {
    static STATE_CACHE: Promise<MasterDataModel[]>;
    static STATE_CACHE_BY_ZONES: Promise<MasterDataModel[]>;
    static ROLE_CACHE: Promise<MasterDataModel[]>;
    static ACTIVITY_CACHE: Promise<MasterDataModel[]>;
    static GLCODE_CACHE: Promise<MasterDataModel[]>;
    static ACT_SAC_DESCRIPTION_CACHE: Promise<MasterDataModel[]>;
    static ACT_SAC_CACHE: Promise<{
        id: number;
        name: string;
        activitySacDesc?:string;
        isDeleted?: boolean;
    }[]>;
    static INTERNAL_ORDER_CACHE: Promise<MasterDataModel[]>;
    static COST_CENTER_FUN_CACHE: Promise<MasterDataModel[]>;
    static CATEGORY_CACHE: Promise<MasterDataModel[]>;
    static AREAS_CACHE: Promise<MasterDataModel[]>;
    static AREAS_CACHE_BY_STATES: Promise<MasterDataModel[]>;
    static DISTRICT_CACHE_BY_STATES: Promise<MasterDataModel[]>;
    static DISTRICTS_CACHE_BY_STATEID: Promise<MasterDataModel[]>;
    static TEHSIL_CACHE_BY_DISTRICT: Promise<MasterDataModel[]>;
    static VILLAGE_CACHE_BY_TEHSIL: Promise<MasterDataModel[]>;
    static DEALERS_CACHE: Promise<MasterDataModel[]>;
    static ZONE_CACHE: Promise<MasterDataModel[]>;
    static ZONE_CACHE_BY_COUNTRY: Promise<MasterDataModel[]>;
    static ZONE_CACHE_BY_REGION: Promise<MasterDataModel[]>;
    static ZONE_CACHE_BY_SUBREGION: Promise<MasterDataModel[]>;
    static STATE_CACHE_BY_COUNTRY: Promise<MasterDataModel[]>;
    static BRANCH_CACHE: Promise<MasterDataModel[]>;
    static ROLE_FEATURE_CACHE: Promise<MasterDataModel[]>;
    static CLIAM_TIMELINE_CACHE: Promise<MasterDataModel[]>;
    static COUNTRY_CACHE: Promise<MasterDataModel[]>;
    static DOC_TYPE_CACHE: Promise<MasterDataModel[]>;
    static CAT_TYPE_CACHE: Promise<MasterDataModel[]>;
    static VENDOR_CACHE: Promise<MasterDataModel[]>;
    static BUSINESS_PLACE_CACHE: Promise<MasterDataModel[]>;
    static PLANT_CACHE: Promise<MasterDataModel[]>;
    static ZONES_CACHE_BY_STATE: Promise<MasterDataModel[]>;
    static STATES_CACHE_BY_AREAS: Promise<MasterDataModel[]>;
    static DIVISION_CACHE_BY_SUBREGION: Promise<MasterDataModel[]>;
    static DEALER_CACHE_BY_SUBREGION: Promise<MasterDataModel[]>;
    static options:PagedRequestOptions;
    apiUrl = environment.apiBaseUrl;
    apiuserUrl=environment.apiuserBaseUrl;
    userId:any;
    constructor(private http: HttpClient, private mockData: MockDataService,private userService : UserService) {
        this.userId = this.userService.getUserId(); 
    }

    async getRoles() {
        if (MasterDataService.ROLE_CACHE) {
            return await MasterDataService.ROLE_CACHE;
        }
        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        MasterDataService.ROLE_CACHE = this.mockData.get('roles').then((res: any) => {
            if (!res || !res.data) { return []; }
            return res.data.content.map((x: any) => ({id: x.id, name: x.name}));
        });
        return await MasterDataService.ROLE_CACHE;
    }

    async getRole(id: number) {
        if (id == null) { return null; }
        let items: MasterDataModel[] = [];
        if (MasterDataService.ROLE_CACHE) {
            items = await MasterDataService.ROLE_CACHE;
        } else {
            items = await this.getRoles();
        }
        return items.find(x => x.id === id);
    }
    async getActivitys() {
        if (MasterDataService.ACTIVITY_CACHE) {
            return await MasterDataService.ACTIVITY_CACHE;
        }

        const url = `${this.apiUrl}/api/v1/activitymanagement/activityTypes`;
        MasterDataService.ACTIVITY_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.activityTypeId, name: x.activityTypeName}));
        })).toPromise();
        return await MasterDataService.ACTIVITY_CACHE;
    }
    async getActivity(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.ACTIVITY_CACHE) {
            items = await MasterDataService.ACTIVITY_CACHE;
        } else {
            items = await this.getActivitys();
        }
        return items && items.find(x => x.id === id);
    }
    async getCliamTimelines() {
        if (MasterDataService.CLIAM_TIMELINE_CACHE) {
            return await MasterDataService.CLIAM_TIMELINE_CACHE;
        }
        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        MasterDataService.CLIAM_TIMELINE_CACHE = this.mockData.get('timeline');
        return await MasterDataService.CLIAM_TIMELINE_CACHE;
    }
    async getCliamTimeline(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.CLIAM_TIMELINE_CACHE) {
            items = await MasterDataService.CLIAM_TIMELINE_CACHE;
        } else {
            items = await this.getCliamTimelines();
        }
        return items && items.find(x => x.id === id);
    }
    async getglcodes() {
        if (MasterDataService.GLCODE_CACHE) {
            return await MasterDataService.GLCODE_CACHE;
        }

        //const url = `${this.apiUrl}/api/v1/activitymanagement/glCodes`;
        const url = `${this.apiUrl}/api/v1/glcodemanagement/glCodes`;
        MasterDataService.GLCODE_CACHE = this.http.post<ApiResponse<PagedData<MasterDataModel[]>>>(url,{}).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.content.map((x: any) => ({id: x.glCodeId, name: x.glCode}));
        })).toPromise();

        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        //MasterDataService.GLCODE_CACHE = this.mockData.get('gl-codes');
        return await MasterDataService.GLCODE_CACHE;
    }
    async getglcode(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.GLCODE_CACHE) {
            items = await MasterDataService.GLCODE_CACHE;
        } else {
            items = await this.getglcodes();
        }
        return items && items.find(x => x.id === id);
    }
    async getActSacDescriptions() {
        if (MasterDataService.ACT_SAC_DESCRIPTION_CACHE) {
            return await MasterDataService.ACT_SAC_DESCRIPTION_CACHE;
        }

        const url = `${this.apiUrl}/api/v1/activitymanagement/activitySacDes`;
        MasterDataService.ACT_SAC_DESCRIPTION_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.activitySacDescId, name: x.activitySacDescription}));
        })).toPromise();

        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        //MasterDataService.ACT_SAC_DESCRIPTION_CACHE = this.mockData.get('act-sac-descriptions');
        return await MasterDataService.ACT_SAC_DESCRIPTION_CACHE;
    }
    async getActSacDescription(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.ACT_SAC_DESCRIPTION_CACHE) {
            items = await MasterDataService.ACT_SAC_DESCRIPTION_CACHE;
        } else {
            items = await this.getActSacDescriptions();
        }
        return items && items.find(x => x.id === id);
    }
    async getActSacs() {
        if (MasterDataService.ACT_SAC_CACHE) {
            return await MasterDataService.ACT_SAC_CACHE;
        }
        const url = `${this.apiUrl}/api/v1/activitymanagement/activitySacs`;
        MasterDataService.ACT_SAC_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.activitySacId, name: x.activitySacName, activitySacDesc:x.activitySacDesc}));
        })).toPromise();
        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        //MasterDataService.ACT_SAC_CACHE = this.mockData.get('act-sacs');
        return await MasterDataService.ACT_SAC_CACHE;
    }
    async getActSac(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.ACT_SAC_CACHE) {
            items = await MasterDataService.ACT_SAC_CACHE;
        } else {
            items = await this.getActSacs();
        }
        return items && items.find(x => x.id === id);
    }
    async getInternalOrders() {
        if (MasterDataService.INTERNAL_ORDER_CACHE) {
            return await MasterDataService.INTERNAL_ORDER_CACHE;
        }
        const url = `${this.apiUrl}/api/v1/activitymanagement/internalOrders`;
        MasterDataService.INTERNAL_ORDER_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.internalOrderId, name: x.internalOrder}));
        })).toPromise();
        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        //MasterDataService.INTERNAL_ORDER_CACHE = this.mockData.get('internal-orders');
        return await MasterDataService.INTERNAL_ORDER_CACHE;
    }
    async getInternalOrder(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.INTERNAL_ORDER_CACHE) {
            items = await MasterDataService.INTERNAL_ORDER_CACHE;
        } else {
            items = await this.getInternalOrders();
        }
        return items && items.find(x => x.id === id);
    }
    async getCostCenterFuns() {
        if (MasterDataService.COST_CENTER_FUN_CACHE) {
            return await MasterDataService.COST_CENTER_FUN_CACHE;
        }
        const url = `${this.apiUrl}/api/v1/activitymanagement/costCenterFunctions`;
        MasterDataService.COST_CENTER_FUN_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.costCenterFunctionId, name: x.costCenterFunctionName}));
        })).toPromise();
        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        //MasterDataService.COST_CENTER_FUN_CACHE = this.mockData.get('cost-center-fun');
        return await MasterDataService.COST_CENTER_FUN_CACHE;
    }
    async getCostCenterFun(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.COST_CENTER_FUN_CACHE) {
            items = await MasterDataService.COST_CENTER_FUN_CACHE;
        } else {
            items = await this.getCostCenterFuns();
        }
        return items && items.find(x => x.id === id);
    }
    async getCategorys() {
        if (MasterDataService.CATEGORY_CACHE) {
            return await MasterDataService.CATEGORY_CACHE;
        }
        const url = `${this.apiUrl}/api/v1/activitymanagement/category`;
        MasterDataService.CATEGORY_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
           if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.categoryId, name: x.categoryName}));
        })).toPromise();
         //MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        //MasterDataService.CATEGORY_CACHE = this.mockData.get('categorys');
        return await MasterDataService.CATEGORY_CACHE;
    }
    async getCategory(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.CATEGORY_CACHE) {
            items = await MasterDataService.CATEGORY_CACHE;
        } else {
            items = await this.getCategorys();
        }
        return items && items.find(x => x.id === id);
    }


    async getStates() {
        if (MasterDataService.STATE_CACHE) {
            return await MasterDataService.STATE_CACHE;
        }
        const url = `${this.apiUrl}/api/v1/statesController/activeStates`;
        MasterDataService.STATE_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        // MasterDataService.STATE_CACHE = this.mockData.get(`states`);
        return await MasterDataService.STATE_CACHE;
    }

    async getStatesByZones(zoneIds: number[], forceQueryFromServer:boolean = false) {
        if (MasterDataService.STATE_CACHE_BY_ZONES && !forceQueryFromServer) {
            return await MasterDataService.STATE_CACHE_BY_ZONES;
        }
        const url = `${this.apiUrl}/api/v1/statesController/statesByZone`;
        MasterDataService.STATE_CACHE_BY_ZONES = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'zoneIds':zoneIds}).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        return await MasterDataService.STATE_CACHE_BY_ZONES;
    }
    async getStatesByCountry(countryId:number, forceQueryFromServer:boolean = false) {
        if (MasterDataService.STATE_CACHE_BY_COUNTRY && !forceQueryFromServer) {
            return await MasterDataService.STATE_CACHE_BY_COUNTRY;
        }
        const url = `${this.apiUrl}/api/v1/statesController/statesByCountry/${countryId}`;
        MasterDataService.STATE_CACHE_BY_COUNTRY = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        return await MasterDataService.STATE_CACHE_BY_COUNTRY;
    }

    async getState(id: number) {
        if (id == null) { return null; }
        let items: MasterDataModel[] = [];
        if (MasterDataService.STATE_CACHE) {
            items = await MasterDataService.STATE_CACHE;
        } else {
            items = await this.getStates();
        }
        return items && items.find(x => x.id === id);
    }

    async getAreas() {
        if (MasterDataService.AREAS_CACHE) {
            return await MasterDataService.AREAS_CACHE;
        }
        const url = `${this.apiUrl}/api/v1/areaOfficesController/activeAreaOffices`;
        MasterDataService.AREAS_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        return await MasterDataService.AREAS_CACHE;
    }

    async getAreasByStates(stateIds: number[], forceQueryFromServer:boolean = false) {
        if (MasterDataService.AREAS_CACHE_BY_STATES && !forceQueryFromServer) {
            return await MasterDataService.AREAS_CACHE_BY_STATES;
        }
        const url = `${this.apiUrl}/api/v1/areaOfficesController/areaOfficesByStates`;
        MasterDataService.AREAS_CACHE_BY_STATES = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'stateIds':stateIds}).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        return await MasterDataService.AREAS_CACHE_BY_STATES;
    }
    async getDistrictByAreas(areaOfficeIds: number[], forceQueryFromServer:boolean = false) {
      if (MasterDataService.DISTRICT_CACHE_BY_STATES && !forceQueryFromServer) {
          return await MasterDataService.DISTRICT_CACHE_BY_STATES;
      }
      const url = `${this.apiUrl}/api/v1/districtController/districtByAreaOffice`;
      MasterDataService.DISTRICT_CACHE_BY_STATES = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'areaOfficeIds':areaOfficeIds}).pipe(map(res => {
          if (!res || !res.data) { return; }
          return res.data.map((x: any) => ({id: x.id, name: x.name}));
      })).toPromise();
      return await MasterDataService.DISTRICT_CACHE_BY_STATES;
    }
    async getTehsilByDistricts(districtIds: number[], forceQueryFromServer:boolean = false) {
      if (MasterDataService.TEHSIL_CACHE_BY_DISTRICT && !forceQueryFromServer) {
          return await MasterDataService.TEHSIL_CACHE_BY_DISTRICT;
      }
      const url = `${this.apiUrl}/api/v1/tehsilController/tehsilByDistricts`;
      MasterDataService.TEHSIL_CACHE_BY_DISTRICT = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'districtIds':districtIds}).pipe(map(res => {
          if (!res || !res.data) { return; }
          return res.data.map((x: any) => ({id: x.id, name: x.name}));
      })).toPromise();
      return await MasterDataService.TEHSIL_CACHE_BY_DISTRICT;
    }
    async getVillageByTehsils(tehsilIds: number[], forceQueryFromServer:boolean = false) {
      if (MasterDataService.VILLAGE_CACHE_BY_TEHSIL && !forceQueryFromServer) {
          return await MasterDataService.VILLAGE_CACHE_BY_TEHSIL;
      }
      const url = `${this.apiUrl}/api/v1/villageController/villageByTehil`;
      MasterDataService.VILLAGE_CACHE_BY_TEHSIL = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'tehsilIds':tehsilIds}).pipe(map(res => {
          if (!res || !res.data) { return; }
          return res.data.map((x: any) => ({id: x.id, name: x.name}));
      })).toPromise();
      return await MasterDataService.VILLAGE_CACHE_BY_TEHSIL;
    }
    async getArea(id: number) {
        if (id == null) { return null; }
        let items: MasterDataModel[] = [];
        if (MasterDataService.AREAS_CACHE) {
            items = await MasterDataService.AREAS_CACHE;
        } else {
            items = await this.getAreas();
        }
        return items && items.find(x => x.id === id);
    }

    async getDealers(areaofficeids:Array<number>) {
        // if (MasterDataService.DEALERS_CACHE) {
        //     return await MasterDataService.DEALERS_CACHE;
        // }
        // MasterDataService.DEALERS_CACHE = this.mockData.get(`dealers`);
        const url = `${this.apiUrl}/api/v1/dealershipController/activeDealership`;
        MasterDataService.DEALERS_CACHE = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'areaOfficeIds':areaofficeids}).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.dealershipId, name: x.name}));
        })).toPromise();
        return await MasterDataService.DEALERS_CACHE;
    }

    async getDealer(id: number,areaofficeids:Array<number>) {
        if (id == null) { return null; }
        let items: MasterDataModel[] = [];
        // if (MasterDataService.DEALERS_CACHE) {
        //     items = await MasterDataService.DEALERS_CACHE;
        // } else {
            items = await this.getDealers(areaofficeids);
       // }
        return items && items.find(x => x.id === id);
    }

    async getZones() {
        if (MasterDataService.ZONE_CACHE) {
            return await MasterDataService.ZONE_CACHE;
        }
        // MasterDataService.ZONE_CACHE = this.mockData.get(`zones`);
        const url = `${this.apiUrl}/api/v1/zonesController/activeZones`;
        MasterDataService.ZONE_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        return await MasterDataService.ZONE_CACHE;
    }


    async getZonesByCountry(countryId:number, forceQueryFromServer:boolean = false) {
        if (MasterDataService.ZONE_CACHE_BY_COUNTRY && !forceQueryFromServer) {
            return await MasterDataService.ZONE_CACHE_BY_COUNTRY;
        }
        const url = `${this.apiUrl}/api/v1/zonesController/zonesByCountry/${countryId}`;
        MasterDataService.ZONE_CACHE_BY_COUNTRY = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        return await MasterDataService.ZONE_CACHE_BY_COUNTRY;
    }

    async getZone(id: number) {
        if (id == null) { return null; }
        let items: MasterDataModel[] = [];
        if (MasterDataService.ZONE_CACHE) {
            items = await MasterDataService.ZONE_CACHE;
        } else {
            items = await this.getZones();
        }
        return items && items.find(x => x.id === id);
    }

    async getBranches() {
        if (MasterDataService.BRANCH_CACHE) {
            return await MasterDataService.BRANCH_CACHE;
        }
        const url = `${this.apiUrl}/api/v1/branchesController/activeBranches`;
        MasterDataService.BRANCH_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return []; }
            return res.data.map((x: any) => ({id: x.id, name: x.name}));
        })).toPromise();
        // MasterDataService.BRANCH_CACHE = this.mockData.get(`branches`);
        return await MasterDataService.BRANCH_CACHE;
    }

    async getBranch(id: number) {
        if (id == null) { return null; }
        let items: MasterDataModel[] = [];
        if (MasterDataService.BRANCH_CACHE) {
            items = await MasterDataService.BRANCH_CACHE;
        } else {
            items = await this.getBranches();
        }
        return items && items.find(x => x.id === id);
    }

    async getCountrys() {
        // if (MasterDataService.COUNTRY_CACHE) {
        //     return await MasterDataService.COUNTRY_CACHE;
        // }
        // MasterDataService.COUNTRY_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(`${this.apiUrl}/api/v1/countries/countries`).pipe(map(res => {
        //     if (!res || !res.data) { return []; }
        //     return res.data.map((x: any) => ({id: x.countryId, name: x.countryName}));
        // })).toPromise();
        return await MasterDataService.COUNTRY_CACHE;
    }

    async getCountry(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.COUNTRY_CACHE) {
            items = await MasterDataService.COUNTRY_CACHE;
        } else {
            items = await this.getCountrys();
        }
        return items && items.find(x => x.id === id);
    }
    async getDocTypes() {
        if (MasterDataService.DOC_TYPE_CACHE) {
            return await MasterDataService.DOC_TYPE_CACHE;
        }
        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        MasterDataService.DOC_TYPE_CACHE = this.mockData.get('doc-type');
        return await MasterDataService.DOC_TYPE_CACHE;
    }
    async getDocType(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.DOC_TYPE_CACHE) {
            items = await MasterDataService.DOC_TYPE_CACHE;
        } else {
            items = await this.getDocTypes();
        }
        return items.find(x => x.id === id);
    }
    async getCatTypes() {
        if (MasterDataService.CAT_TYPE_CACHE) {
            return await MasterDataService.CAT_TYPE_CACHE;
        }

        const url = `${this.apiUrl}/api/referenceDocument/v1/document_categories`;
        MasterDataService.CAT_TYPE_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
            if (!res || !res.data) { return; }
            return res.data.map((x: any) => ({id: x.documentCategoryId, name: x.categoryName}));
        })).toPromise();
        // MasterDataService.STATE_CACHE = this.mockData.get(`states`);
        return await MasterDataService.CAT_TYPE_CACHE;
    }
    async getCatType(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.CAT_TYPE_CACHE) {
            items = await MasterDataService.CAT_TYPE_CACHE;
        } else {
            items = await this.getCatTypes();
        }
        return items.find(x => x.id === id);
    }
    async getVendors() {
        if (MasterDataService.VENDOR_CACHE) {
            return await MasterDataService.VENDOR_CACHE;
        }
        // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();
        MasterDataService.VENDOR_CACHE = this.mockData.get('vendor');
        return await MasterDataService.VENDOR_CACHE;
    }
    async  getVendor(id: number) {
        let items: MasterDataModel[] = [];
        if (MasterDataService.VENDOR_CACHE) {
            items = await MasterDataService.VENDOR_CACHE;
        } else {
            items = await this.getVendors();
        }

        return items.find(x => x.id === id);
    }

    // async getActivityNames() {
    //     if (MasterDataService.Activity_Name_CACHE) {
    //         return await MasterDataService.Activity_Name_CACHE;
    //     }
    //     // MasterDataService.ROLE_CACHE = this.http.get<MasterDataModel[]>(`${this.apiUrl}/roles`).toPromise();


    //     return MasterDataService.Activity_Name_CACHE =


    //     this.http.get<PagedResponse<ActivityMasterModel>>(`${this.apiUrl}/api/v1/activitymanagement/activities`,{ params: HttpUtil.convertReqOptionToParams( {
    //         page: 0,
    //         size: 11,
    //         sort: 'desc'
    //     })}).pipe(map(res => {
    //         if (!res || !res.data||!res.data.content) { return; }
    //         return res.data?.content.map((x: any) => ({id: x.activityId, name: x.activityName,categoryId: x.categoryId}));
    //     })).toPromise();
    //     //MasterDataService.Activity_Name_CACHE = this.mockData.get('vendor');
    //     //return await MasterDataService.Activity_Name_CACHE;
    // }
    async getPlants() {
      if (MasterDataService.PLANT_CACHE) {
          return await MasterDataService.PLANT_CACHE;
      }

      const url = `${this.apiUrl}/api/v1/plantmanagement/plants`;
      MasterDataService.PLANT_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
          if (!res || !res.data) { return; }
          return res.data.map((x: any) => ({id: x.plantId, name: x.plantCode}));
      })).toPromise();
      return await MasterDataService.PLANT_CACHE;
  }
    async getBusinessPlaces() {
      if (MasterDataService.BUSINESS_PLACE_CACHE) {
          return await MasterDataService.BUSINESS_PLACE_CACHE;
      }

      const url = `${this.apiUrl}/api/v1/businessplacemanagement/businessPlaces`;
      MasterDataService.BUSINESS_PLACE_CACHE = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
          if (!res || !res.data) { return; }
          return res.data.map((x: any) => ({id: x.businessPlaceId, name: x.businessPlace}));
      })).toPromise();
      return await MasterDataService.BUSINESS_PLACE_CACHE;
  }
  async getZonesByStates(stateIds: number[], forceQueryFromServer:boolean = false) {
    if (MasterDataService.ZONES_CACHE_BY_STATE && !forceQueryFromServer) {
        return await MasterDataService.ZONES_CACHE_BY_STATE;
    }
    const stateId= stateIds.join(",");
    const url = `${this.apiUrl}/api/v1/statesController/states?statesIds=${stateId}`;
    MasterDataService.ZONES_CACHE_BY_STATE =  this.http.get<ApiResponse<any>>(url,{}).pipe(map( res => {
        if (!res || !res.data) { return; }
        let data= res.data.map((x:any)=>x.zoneId);
        var sett = new Set(data);
        data = [...sett];
        return  Promise.all(data.map((x: any) => this.getZone(x))) as any;
       
       
    })).toPromise();
    return await MasterDataService.ZONES_CACHE_BY_STATE;
}
async getStatesByArea(areaIds: number[], forceQueryFromServer:boolean = false) {
    if (MasterDataService.STATES_CACHE_BY_AREAS && !forceQueryFromServer) {
        return await MasterDataService.STATES_CACHE_BY_AREAS;
    }
    const areaId= areaIds.join(",");
    const url = `${this.apiUrl}/api/v1/areaOfficesController/areaOffices?areaOfficeIds=${areaId}`;
    MasterDataService.STATES_CACHE_BY_AREAS =  this.http.get<ApiResponse<any>>(url,{}).pipe(map( res => {
        if (!res || !res.data) { return; }
        let data= res.data.map((x:any)=>x.stateId);
        var sett = new Set(data);
        data = [...sett];
        return  Promise.all(data.map((x: any) => this.getState(x))) as any;
       
       
    })).toPromise();
    return await MasterDataService.STATES_CACHE_BY_AREAS;
}
async getDistricByStateId(sateId:number, forceQueryFromServer:boolean = false) {
    if (MasterDataService.DISTRICTS_CACHE_BY_STATEID && !forceQueryFromServer) {
        return await MasterDataService.DISTRICTS_CACHE_BY_STATEID;
    }
    const url = `${this.apiUrl}/api/v1/districtController/districtByStateId/${sateId}`;
    MasterDataService.DISTRICTS_CACHE_BY_STATEID = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.id, name: x.name}));
    })).toPromise();
    return await MasterDataService.DISTRICTS_CACHE_BY_STATEID;
}

async gettopMenuDetail(forceQueryFromServer:boolean = false) {
    var roleId = this.userService.getUserRoleId();
    const url = `${this.apiuserUrl}/v1/api/MenuService/getMenuList?roleId=${roleId}`;
    const docCat = this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map(res => {
        localStorage.setItem('MenuOption',JSON.stringify(res.data))
        if (!res || !res.data) { return []; }

        return res.data.map((x: any) => ({id: x.menuId, name: x.menuName,subMenu: x.submenuList, url: x.menuUrl}));
    })).toPromise();
    return await docCat;
}

async getMenudetail(id: number,forceQueryFromServer:boolean = false) {
    var roleId = this.userService.getUserRoleId();
    const url = `${this.apiuserUrl}/v1/api/MenuService/getSubMenuList?menuId=${id}&roleId=${roleId}`;
    const cat1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map(res => {
        if (!res || !res.data) { return []; }
        
         return res.data.map((x: any) => ({id: x.subMenuId,
            name: x.subMenuName,Url:x.subMenuUrl}));
   
    })).toPromise();
    return await cat1;
}
async getSubRegion(regionIds: any, forceQueryFromServer: boolean = false) {
    if (MasterDataService.ZONE_CACHE_BY_SUBREGION && !forceQueryFromServer) {
      return await MasterDataService.ZONE_CACHE_BY_SUBREGION;
    }
    var subRegionIds;
    if(regionIds.length>0){
      subRegionIds = {'subRegions': regionIds};
    }else{
      subRegionIds ={};
    }
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getSubRegionDropDown?userId=${this.userId}`;
    MasterDataService.ZONE_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url,subRegionIds).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({ id: x.subRegionId, name: x.subRegionName }));
    })).toPromise();
    return await MasterDataService.ZONE_CACHE_BY_SUBREGION;
  }
  async getDivision(id: any, forceQueryFromServer: boolean = false) {
    if (MasterDataService.DIVISION_CACHE_BY_SUBREGION && !forceQueryFromServer) {
      return await MasterDataService.DIVISION_CACHE_BY_SUBREGION;
    }
    var divisionIds;
    if(id.length>0){
      divisionIds = {'divisions': id};
    }else{
      divisionIds = {};
    }
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getDivisionDropDown?userId=${this.userId}`;
    MasterDataService.DIVISION_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url, divisionIds).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({ id: x.divisionId, name: x.divisionName }));
    })).toPromise();
    return await MasterDataService.DIVISION_CACHE_BY_SUBREGION;
  }
  async getMarket(id: any, forceQueryFromServer: boolean = false) {
    if (MasterDataService.ZONE_CACHE_BY_COUNTRY && !forceQueryFromServer) {
      return await MasterDataService.ZONE_CACHE_BY_COUNTRY;
    }
    var marketIds;
  if(id.length>0){
    marketIds ={'markets': id};
  }else{
    marketIds ={}
  }
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getMarketDropDown?userId=${this.userId}`;
    MasterDataService.ZONE_CACHE_BY_COUNTRY = this.http.post<ApiResponse<MasterDataModel[]>>(url,marketIds).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({ id: x.marketId, name: x.marketName }));
    })).toPromise();
    return await MasterDataService.ZONE_CACHE_BY_COUNTRY;
  }

  async getDocCat1(id: number,forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubCategoryDropDown`;
    const cat1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'documentCategoryId':id}).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.documentSubCategoryId,
             name: x.documentSubCategoryName}));
   
    })).toPromise();
    //console.log(cat1);
    return await cat1;
}
async getDocCat2(id: number,forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildCategoryDropDown`;
    const cat1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,{'documentSubCategoryId':id}).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.documentSubChildCategoryId, name: x.documentSubChildCategoryName}));
    })).toPromise();
    return await cat1;
}
async getDocumentFileType(forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentGridService/documentFileType`;
    const docCat = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res =>{
        if (!res || !res.data) { return []; }
        return res.data.map((x: any,index:number) => ({id: index, name: x}));
    })).toPromise();
    
    return await docCat;
    
}

async getfilterDocumentFileType(forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentGridService/documentFileType`;
    const docCat = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res =>{
        if (!res || !res.data) { return []; }
        return res.data.map((x: any,index:number) => ({documentTypeId: index, documentTypeName: x}));
    })).toPromise();
    
    return await docCat;
    
}
async getfilterLanguageType(forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/LocationManagementService/getLanguageDropDown`;
    //const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildCategoryDropDown`;
    const language1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any) => ({id: x.languageId, name: x.languageName}));
    })).toPromise();
    return await language1;
}
async getLanguage(racfId) {
    
    const url = `${this.apiuserUrl}/v1/api/language/getLanguageList/${racfId}`;
    //const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildCategoryDropDown`;
    const language1 = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map((res:any) => {
        if (!res || !res) { return []; }
        // console.log('res',res);
        localStorage.setItem('languageData',JSON.stringify(res));
        return res.map((x: any) => ({id: x.languageId, name: x.languageName, checked:x.checked,langCode:x.languageIsoCode}));
    })).toPromise();
    return await language1;
}
async setLanguage(racfId,id) {
    
    const url = `${this.apiuserUrl}/v1/api/language/setLanguageList/${racfId}/${id}`;
    //const url = `${this.apiUrl}/v1/api/DocumentManagementService/getDocumentSubChildCategoryDropDown`;
    const language1 = this.http.post<ApiResponse<MasterDataModel[]>>(url,null).pipe(map((res:any) => {
        if (!res || !res) { return []; }
        console.log('res',res)
        return res.map((x: any) => ({id: x.languageId, name: x.languageName, checked:x.checked}));
    })).toPromise();
    return await language1;
}
async getFilterFileType(forceQueryFromServer:boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentGridService/documentFileType`;
    const docCat = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res =>{
        if (!res || !res.data) { return []; }
        return res.data.map((x: any,index:number) => ({id: index, name: x}));
    })).toPromise();
    
    return await docCat;
    
}

async getYear(){
    const year =[{id:1, name: "2018"},{id:2,name:"2019"},{id:3,name:"2020"},{id:4,name:"2021"},{id:5,name:"2022"},{id:6,name:"2023"}];
    return year;
    // var currentYear;
    // var yearFilter;
    // var year =[];
    // for(let i = (currentYear - 10); i < (currentYear + 10); i++) {
    //     year.push(i);
    // }
    // // yearFilter = year.map((x: any,index:number) => { 
    // //        return { id:x, name:x }
    // //    })
    //    console.log(year);
}
async getDealerNew(id: any, forceQueryFromServer: boolean = false) {
    if (MasterDataService.DEALER_CACHE_BY_SUBREGION && !forceQueryFromServer) {
      return await MasterDataService.DEALER_CACHE_BY_SUBREGION;
    }
    const url = `${this.apiuserUrl}/v1/api/dealerController/getActiveDealersDropDown`;
    MasterDataService.DEALER_CACHE_BY_SUBREGION = this.http.post<ApiResponse<MasterDataModel[]>>(url, { 'markets': id }).pipe(map(res => {
      if (!res || !res.data) { return []; }
      return res.data.map((x: any) => ({ id: x.dealerCode, name: x.dealerName }));
    })).toPromise();
    return await MasterDataService.DEALER_CACHE_BY_SUBREGION;
  }

  async getTrndDealer(page, size) {
    const url = `${this.apiUrl}/v1/api/DocumentGridService/getTopTrendingDealer`;
    const docCat = this.http.post<ApiResponse<MasterDataModel[]>>(url, { page, size }).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any, index: number) => ({ id: index, name: x }));
    })).toPromise();

    return await docCat;
}
async getTrndDoc(page, size) {
    const url = `${this.apiUrl}/v1/api/DocumentGridService/getTrendingDocuments`;
    const docCat = this.http.post<ApiResponse<MasterDataModel[]>>(url, { page, size }).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any, index: number) => ({ id: index, name: x }));
    })).toPromise();

    return await docCat;
}
async getDocumentUploadReport(forceQueryFromServer: boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentGridService/documentFileType`;
    const docCat = this.http.get<ApiResponse<MasterDataModel[]>>(url).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any, index: number) => ({ id: index, name: x }));
    })).toPromise();

    return await docCat;
}
async getDocumentDownloadReport(forceQueryFromServer: boolean = false) {
    const url = `${this.apiUrl}/v1/api/DocumentGridService/getDownloadedDocumentTypeAndCount`;
    const docCat = this.http.post<ApiResponse<MasterDataModel[]>>(url, null).pipe(map(res => {
        if (!res || !res.data) { return []; }
        return res.data.map((x: any, index: number) => ({ id: index, name: x }));
    })).toPromise();

    return await docCat;
}


}
