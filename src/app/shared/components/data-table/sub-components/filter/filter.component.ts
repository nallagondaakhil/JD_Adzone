import { Component, OnInit, Output,EventEmitter, Input, OnDestroy, ChangeDetectorRef, OnChanges } from '@angular/core';
// import { stat } from 'node:fs';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { FilterSettings, SelectOptions } from '../../models/data-table-model';
import { ObjectUtil } from 'src/app/shared/utils/object-util';
import { UserManagementModelMapper,UserManagementView } from 'src/app/modules/adzone-admin/user-management/models/user-management-view.model';
import { AlertsService } from 'src/app/shared/services/alerts.service';
UserManagementModelMapper
@Component({
  selector: 'jd-datatable-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {

  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onFilterButtonClick: EventEmitter<FilterSettings[]> = new EventEmitter();
  @Input() filters: FilterSettings[];
  @Input() state: boolean;
  @Output() onFilterUpdated: EventEmitter<boolean> =  new EventEmitter();
  regions: MasterDataModel[];
  filetype: MasterDataModel[];
  year:MasterDataModel[];
  subRegionOptions: MasterDataModel[] = [];
  countries: MasterDataModel[] = [];
  approval: MasterDataModel[] = [];
  divisionOptions: MasterDataModel[] = [];
  countryOptions: MasterDataModel[] = [];
  dealerOptions:MasterDataModel[] = [];
  zones: MasterDataModel[] = [];
  states: MasterDataModel[] = [];
  areaOffices: MasterDataModel[] = [];
  district : MasterDataModel[] = [];
  teshil : MasterDataModel[]=[];
  village : MasterDataModel []=[];
  locationFilters: Map<string,FilterSettings> = new Map();
  viceVersaLocationFilters: Map<string,FilterSettings> = new Map();
  selectedCountry: MasterDataModel[];
  selectedCountryy:MasterDataModel[];
  selectedRegion: MasterDataModel[];
  selectedYear: MasterDataModel[];
  selectedRole: MasterDataModel[];
  selectedStatusOrder: MasterDataModel[];
  selectedOrderType: MasterDataModel[];
  selectedFileType : MasterDataModel[];
  selectedSubRegion: MasterDataModel[];
  selectedDivision:MasterDataModel[];
  selectedZones: MasterDataModel[];
  selectedStates: MasterDataModel[];
  selectedStatesByArea:MasterDataModel[];
  selectedAreaOffices: MasterDataModel[];
  selectedDistrict : MasterDataModel[];
  selectedTeshil : MasterDataModel[];
  selectedVillage : MasterDataModel[];
  selectedViceVersaCountry: MasterDataModel[];
  selectedViceVersaZones: MasterDataModel[];
  selectedViceVersaStates: MasterDataModel[];
  selectedViceVersaAreaOffices: MasterDataModel[];
  viceVersaCountries: MasterDataModel[] = [];
  viceVersaZones: MasterDataModel[] = [];
  viceVersaStates: MasterDataModel[] = [];
  viceVersaAreaOffices: MasterDataModel[] = [];
  // userViewModel: UserViewModel;
  vstates: MasterDataModel[];
  vareas: MasterDataModel[];
  vzones: MasterDataModel[];
  vcountry?: MasterDataModel;
  category: MasterDataModel[];
  SubCategory: MasterDataModel[];
  Category2: MasterDataModel[];
  dealerReport:MasterDataModel[];
  selectedCategory: MasterDataModel[];
  selectedApproval: MasterDataModel[];
  selectedSubCategory: MasterDataModel[];
  selectedCategory2: MasterDataModel[];
  selectedMarketNew:MasterDataModel[];
  selectedDealer:MasterDataModel[];
  selectedDealerReport:MasterDataModel[];

  statusOptions: MasterDataModel[] = [
    {
      id: 1,
      name: 'Active'
    },
    {
      id: 0,
      name: 'Inactive'
    }
  ];
  approvalOptions: MasterDataModel[] = [
    {
      id: 1,
      name: 'Rejected'
    },
    {
      id: 0,
      name: 'Approved'
    },
    {
      id: 2,
      name: 'Waiting for Review'
    }
  ];


  showComponent: boolean = true;
  constructor(
    private masterDataService: MasterDataService,
    // private userManagementService: UserManagementService,
    private userService:UserService,
    // private roleService: RoleManagementService,
    private cdr: ChangeDetectorRef,
    private alertService:AlertsService,
  ) { }

  ngOnChanges(value: any){
    if(value!=undefined && value.state!=undefined)
      this.state = value.state.currentValue;
     else
      this.state = true; 
  }

  async ngOnInit(): Promise<void> {
    
    if(this.filters != null){
      this.filters.forEach(filter => {
        if(filter.type === 'country' || filter.type === 'status' ||filter.type === 'supplier'|| filter.type === 'dealer'  || filter.type === 'zones' || filter.type === 'states' || filter.type === 'areaOffices'|| filter.type =='areaOfficesSingleSelect' || filter.type =='statesByAreaOffice' || filter.type =='district' || filter.type=='village' || filter.type =='teshil'|| filter.type =='region' || filter.type =='sub-region' || filter.type =='division' || filter.type =='category' || filter.type =='sub-category' || filter.type =='category2' ||filter.type =='market' ||filter.type =='roles' || filter.type == 'statusOrder' || filter.type =='filetype' || filter.type =='year'|| filter.type == 'orderType' || filter.type=='marketnew' || filter.type=='dealerReport' || filter.type=='approval'){
    
          switch(filter.type){
            case 'region':
              var regionIds: {id: number,name:string}[] = []
              console.log('region',filter.value)
              filter.value?.forEach(x => {
                regionIds.push({id:x?.regionId,name:x?.regionName});
               });
                this.selectedRegion = regionIds;
              break;
            case 'approval':
              var approval: {id: number,name:string}[] = [];
              filter.value?.forEach((x:any) => {
                approval.push({id:x?.id,name:x?.name});
               });
               
                this.selectedApproval = approval;
                console.log('approval',this.selectedApproval)
              break;
              case 'sub-region':
               var subregionIds: {id: number,name:string}[] = []
               filter.value?.forEach(x => {
                  subregionIds.push({id:x?.subRegionId,name:x?.subRegionName});
                });
                this.selectedSubRegion = subregionIds;
              break;
              case 'division':
                var ids: {id: number,name:string}[] = []
                filter.value?.forEach(x => {
                  ids.push({id:x?.divisionId,name:x?.divisionName});
                });
                this.selectedDivision = ids;
              break;
              case 'market':
                console.log(filter.value);
                var marketIds: {id: number,name:string}[] = []
                filter.value?.forEach(x => {
                  marketIds.push({id:x?.marketId,name:x?.marketName});
                });
                this.selectedCountry = marketIds;
                console.log(this.selectedCountry);
              break;
              case 'roles':
                var roleIds: {id: number,name:string}[] = []
                filter.value?.forEach(x => {
                roleIds.push({id:x?.roleId,name:x?.roleName});
                });
              this.selectedRole = roleIds;
              break;
              case 'dealerReport':
              this.selectedDealerReport = filter.value;
              break;
              case 'statusOrder':
                this.selectedStatusOrder = filter.value;
              break;
              case 'orderType':
                this.selectedOrderType = filter.value;
              break;
            case 'country':
              this.selectedCountryy = filter.value;
              break;
            case 'zones':
              this.selectedZones = filter.value;
              break;
            case 'states':
              this.selectedStates = filter.value;
              break;

            case 'areaOffices':
              this.selectedAreaOffices = filter.value;
              break;
            case 'statesByAreaOffice':
              this.selectedStatesByArea = filter.value;
              break;
            case 'areaOfficesSingleSelect':
              this.selectedAreaOffices = filter.value;
              break;

            case 'district':
              this.selectedDistrict = filter.value;
              break;
            case 'village':
              this.selectedVillage = filter.value;
              break;
            case 'teshil':
              this.selectedTeshil = filter.value;
              break;
              case 'category':
                var roleIds: {id: number,name:string}[] = []
                filter.value?.forEach(x => {
                roleIds.push({id:x?.id,name:x?.name});
                });
                console.log('category',roleIds)
              //this.selectedRole = roleIds;
                  //this.selectedSubCategory = roleIds;
                this.selectedCategory = roleIds;
                break;
                case 'sub-category':
                  var roleIds: {id: number,name:string}[] = []
                filter.value?.forEach(x => {
                roleIds.push({id:x?.id,name:x?.subCategoryName});
                });
              //this.selectedRole = roleIds;
                  this.selectedSubCategory = roleIds;
                  break;
                  case 'category2':
                    this.selectedCategory2 = filter.value;
                    break;
                    case 'year':
                      var years: {id: number,name:string}[] = []
                      filter.value?.forEach(x => {
                        years.push({id:x?.id,name:x?.year});
                      });
                      this.selectedYear = years;
                      break;
                      case 'marketnew':
                      var marketnewIds: {id: number,name:string}[] = []
                      filter.value?.forEach(x => {
                        marketnewIds.push({id:x?.marketId,name:x?.marketName});
                      });
                      this.selectedMarketNew = marketnewIds;
                      break;
                      case 'dealer':
                      var dealerIds: {id: number,name:string}[] = []
                      filter.value?.forEach(x => {
                        dealerIds.push({id:x?.dealerId,name:x?.dealerName});
                      });
                      this.selectedDealer = dealerIds;
                      break;
                      
                  case 'filetype':
                var fileTypeIds: {id: number,name:string}[] = []
                filter.value?.forEach(x => {
                  fileTypeIds.push({id:x?.id,name:x?.type});
                });
                this.selectedFileType = fileTypeIds;
                    //this.selectedFileType = filter.value;
                break;

            default:
              break;
          }
          this.locationFilters.set(filter.type,filter);
        }
        if (filter.type === 'viceVersaCountry' || filter.type === 'viceVersaZones' || filter.type === 'viceVersaStates' || filter.type === 'viceVersaAreaOffices') {
          switch (filter.type) {
            case 'viceVersaCountry':
              this.selectedViceVersaCountry = filter.value;
              break;
            case 'viceVersaZones':
              this.selectedViceVersaZones = filter.value;
              break;
            case 'viceVersaStates':
              this.selectedViceVersaStates = filter.value;
              break;
            case 'viceVersaAreaOffices':
              this.selectedViceVersaAreaOffices = filter.value;
              break;
            default:
              break;
          }
          this.viceVersaLocationFilters.set(filter.type, filter);
        }
      });
      if(this.locationFilters?.size){
        this.masterDataService.getCountrys().then(country => {
          this.countries = country;
        });
      }
    }
    if (this.viceVersaLocationFilters?.size) {
      try { 
        if(this.userService.isVendor())
        {
          this.viceVersaCountries = await this.masterDataService.getCountrys();
          this.viceVersaZones = await this.masterDataService.getZones();
          this.viceVersaAreaOffices = await this.masterDataService.getAreas();
          this.viceVersaStates =await this.masterDataService.getStates();
          
          this.vcountry= this.viceVersaCountries[0];
          this.vzones = this.viceVersaZones;
          this.vareas= this.viceVersaAreaOffices;
          this.vstates= this.viceVersaStates;

         // this.vdistrict = this.masterDataService.getDistrictByAreas();

        }
        else{
          // this.userManagementService.getUser(this.userService.userInfo.racfId).subscribe(async res => {
          //   if (res?.data?.jdUserId && !res.error) {
          //     this.userViewModel = await UserModelMapper.mapToViewModel(res.data, this.masterDataService, this.roleService);
          //     if (this.userViewModel != null ) {
          //       this.viceVersaCountries = [this.userViewModel.country];
          //       this.viceVersaZones = this.userViewModel.zones;
          //       this.viceVersaAreaOffices = this.userViewModel.areas;
          //       this.viceVersaStates = this.userViewModel.states;
          //     }
          //   }
          // }, err => {
  
          // });

          
        }
       
      }
      catch (error) {
        console.error(error);
      }
    }
    
  
  }

  async onLocationFilterChanged(filterType: string,thisValue: MasterDataModel[]){
    switch(filterType){
      case 'region':
        var regionIds: {regionId: number,regionName:string}[] = []
        thisValue?.forEach(x => {
          regionIds.push({regionId:x?.id,regionName:x?.name});
        });
        if(thisValue?.length){
          if(this.locationFilters.get('region')){
            this.filters.find(filter => filter.type === 'region').value = regionIds;
            this.onFilterUpdated.emit(true);
          }
          if(this.locationFilters.get('sub-region')){
            this.subRegionOptions = await this.masterDataService.getSubRegion(regionIds, true);
            this.subRegionOptions = this?.subRegionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)

          }
        }else{
          if(this.locationFilters.get('region')){
            this.filters.find(filter => filter.type === 'region').value = [];
          }
          this.subRegionOptions = await this.masterDataService.getSubRegion(regionIds, true);
            this.subRegionOptions = this?.subRegionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
        }
        break;
        
        case 'sub-region':
        var subregionIds: {subRegionId: number,subRegionName:string}[] = []
        thisValue?.forEach(x => {
          subregionIds.push({subRegionId:x?.id,subRegionName:x?.name});
        });
            if(thisValue?.length){
            if(this.locationFilters.get('sub-region')){
              this.filters.find(filter => filter.type === 'sub-region').value = subregionIds;
              this.onFilterUpdated.emit(true);
            }
            if(this.locationFilters.get('division')){
              this.divisionOptions = await this.masterDataService.getDivision(subregionIds, true);
              this.divisionOptions = this?.divisionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
            }
          }else{
            if(this.locationFilters.get('sub-region')){
              this.filters.find(filter => filter.type === 'sub-region').value = [];
            }
            this.divisionOptions = await this.masterDataService.getDivision(subregionIds, true);
            this.divisionOptions = this?.divisionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
            //this.divisionOptions = [];
            //this.selectedDivision = [];
          }
          // this.states = [];
          // this.selectedStates = [];
          // this.areaOffices = [];
          // this.selectedAreaOffices = [];
         
          break;
          case 'division':
            var ids: {divisionId: number,divisionName:string}[] = []
            thisValue?.forEach(x => {
              ids.push({divisionId:x?.id,divisionName:x?.name});
            });
            if(thisValue?.length){
            if(this.locationFilters.get('division')){
              this.filters.find(filter => filter.type === 'division').value = ids;
              this.onFilterUpdated.emit(true);
            }
            if(this.locationFilters.get('market')){
              this.countryOptions = await this.masterDataService.getMarket(ids, true);
              this.countryOptions = this?.countryOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
            }
          }else{
            if(this.locationFilters.get('division')){
              this.filters.find(filter => filter.type === 'division').value = [];
            }
            this.countryOptions = await this.masterDataService.getMarket(ids, true);
              this.countryOptions = this?.countryOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
            //this.countryOptions = [];
            //this.selectedCountry = [];
          }
         
          break;
          case 'market':
            var marketIds: {marketId: number,marketName:string}[] = []
            thisValue?.forEach(x => {
              marketIds.push({marketId:x?.id,marketName:x?.name});
            });
            if(thisValue?.length){
              //let villageIds: number[] = [];
              //thisValue.forEach(filter => villageIds.push(filter.id));
              this.filters.find(filter => filter.type === 'market').value = marketIds;
              
              this.onFilterUpdated.emit(true);
            }else{
              if(this.locationFilters.get('market')){
                this.filters.find(filter => filter.type === 'market').value = [];
              }
              
            }
          break;
          case 'marketnew':
            var marketnewIds: {marketId: number,marketName:string}[] = []
            thisValue?.forEach(x => {
              marketnewIds.push({marketId:x?.id,marketName:x?.name});
            });
            
                if(thisValue?.length){
                if(this.locationFilters.get('marketnew')){
                  this.filters.find(filter => filter.type === 'marketnew').value = marketnewIds;
                  this.onFilterUpdated.emit(true);
                }
                if(this.locationFilters.get('dealer')){
                  this.dealerOptions = await this.masterDataService.getDealerNew(marketnewIds, true);
                  this.dealerOptions = this?.dealerOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
                }
              }else{
                if(this.locationFilters.get('marketnew')){
                  this.filters.find(filter => filter.type === 'marketnew').value = [];
                }
                //this.dealerOptions = await this.masterDataService.getDivision(subregionIds, true);
                //this.dealerOptions = this?.divisionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
                this.dealerOptions = [];
                this.selectedDealer = [];
              }
              // this.states = [];
              // this.selectedStates = [];
              // this.areaOffices = [];
              // this.selectedAreaOffices = [];
             
              break;
              case 'dealer':
                var dealerIds: {dealerId: number,dealerName:string}[] = []
                thisValue?.forEach(x => {
                  dealerIds.push({dealerId:x?.id,dealerName:x?.name});
                });
                if(thisValue?.length){
                  //let villageIds: number[] = [];
                  //thisValue.forEach(filter => villageIds.push(filter.id));
                  this.filters.find(filter => filter.type === 'dealer').value = dealerIds;
                  
                  this.onFilterUpdated.emit(true);
                }else{
                  if(this.locationFilters.get('dealer')){
                    this.filters.find(filter => filter.type === 'dealer').value = [];
                  }
                  
                }
              break;

          case 'year':
            var years: {year:string}[] = []
            thisValue?.forEach(x => {
              years.push({year:x?.name});
            });
            if(thisValue?.length){
              let yearIds:number[] = [];
              thisValue.forEach(filter => yearIds.push(filter.id));
              if(this.locationFilters.get('year')){
                this.filters.find(filter => filter.type === 'year').value = years;
                this.onFilterUpdated.emit(true);
              }
              // if(this.locationFilters.get('states')){
              //   this.states = await this.masterDataService.getStatesByZones(yearIds, true);
              // }
            }else{
              if(this.locationFilters.get('year')){
                this.filters.find(filter => filter.type === 'year').value = [];
              }
              //this.states = [];
              //this.selectedStates = [];
            }
          break;
          case 'approval':
            if(thisValue?.length){
              let approvalId:number[] = [];
              thisValue.forEach(filter => approvalId.push(filter.id));
             
              if(this.locationFilters.get('approval')){
                this.filters.find(filter => filter.type === 'approval').value = thisValue;
               let filterData =  this.filters.find(filter => filter.type === 'approval');
               
                this.onFilterUpdated.emit(true);
              }
            }else{
              if(this.locationFilters.get('approval')){
                this.filters.find(filter => filter.type === 'approval').value = [];
              }
            }
          break;
          case 'category':
            if(thisValue?.length){
              let categoryId:number[] = [];
              thisValue.forEach(filter => categoryId.push(filter.id));
              if(this.locationFilters.get('category')){
                this.filters.find(filter => filter.type === 'category').value = thisValue;
                this.onFilterUpdated.emit(true);
              }
              if(this.locationFilters.get('sub-category')){
                this.SubCategory = await this.masterDataService.getDocCat1(thisValue[0].id, true);
                this.SubCategory = this?.SubCategory?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
              }
            }else{
              if(this.locationFilters.get('category')){
                this.filters.find(filter => filter.type === 'category').value = [];
              }
            }
          break;
          case 'statusOrder':
            if(thisValue?.length){
              let orderIds:number[] = [];
              thisValue.forEach(filter => orderIds.push(filter.id));
              if(this.locationFilters.get('statusOrder')){
                this.filters.find(filter => filter.type === 'statusOrder').value = thisValue;
                this.onFilterUpdated.emit(true);
              }
              // if(this.locationFilters.get('states')){
              //   this.states = await this.masterDataService.getStatesByZones(yearIds, true);
              // }
            }else{
              if(this.locationFilters.get('statusOrder')){
                this.filters.find(filter => filter.type === 'statusOrder').value = [];
              }
              //this.states = [];
              //this.selectedStates = [];
            }
          break;
          case 'dealerReport':
            if(thisValue?.length){
              let dealerIds:any[] = [];
              thisValue.forEach(filter => dealerIds.push(filter.id));
              if(this.locationFilters.get('dealerReport')){
                this.filters.find(filter => filter.type === 'dealerReport').value = thisValue;
                this.onFilterUpdated.emit(true);
              }
              // if(this.locationFilters.get('states')){
              //   this.states = await this.masterDataService.getStatesByZones(yearIds, true);
              // }
            }else{
              if(this.locationFilters.get('dealerReport')){
                this.filters.find(filter => filter.type === 'dealerReport').value = [];
              }
              //this.states = [];
              //this.selectedStates = [];
            }
          break;

          case 'orderType':
            if(thisValue?.length){
              let orderIds:number[] = [];
              thisValue.forEach(filter => orderIds.push(filter.id));
              if(this.locationFilters.get('orderType')){
                this.filters.find(filter => filter.type === 'orderType').value = thisValue;
                this.onFilterUpdated.emit(true);
              }
            }else{
              if(this.locationFilters.get('orderType')){
                this.filters.find(filter => filter.type === 'orderType').value = [];
              }
            }
          break;

          case 'filetype':
            var fileTypeIds: {id: number,type:string}[] = []
            thisValue?.forEach(x => {
              fileTypeIds.push({id:x?.id,type:x?.name});
            });
            if(thisValue?.length){
              //let villageIds: number[] = [];
              //thisValue.forEach(filter => villageIds.push(filter.id));
              this.filters.find(filter => filter.type === 'filetype').value = fileTypeIds;
              
              this.onFilterUpdated.emit(true);
            }else{
              if(this.locationFilters.get('filetype')){
                this.filters.find(filter => filter.type === 'filetype').value = [];
              }
              
            }
          break;

          case 'roles':
            var roleIds: {roleId: number,roleName:string}[] = []
            thisValue?.forEach(x => {
              roleIds.push({roleId:x?.id,roleName:x?.name});
            });
            if(thisValue?.length){
              //let villageIds: number[] = [];
              //thisValue.forEach(filter => villageIds.push(filter.id));
              this.filters.find(filter => filter.type === 'roles').value = roleIds;
              console.log(roleIds);
              this.onFilterUpdated.emit(true);
            }else{
              if(this.locationFilters.get('roles')){
                this.filters.find(filter => filter.type === 'roles').value = [];
              }
              
            }
          break;

          case 'sub-category':
            var subCategory: {id: number,subCategoryName:string}[] = []
            thisValue?.forEach(x => {
              subCategory.push({id:x?.id,subCategoryName:x?.name});
            });
            if(thisValue?.length){
            if(this.locationFilters.get('sub-category')){
              this.filters.find(filter => filter.type === 'sub-category').value = subCategory;
              this.onFilterUpdated.emit(true);
            }
            if(this.locationFilters.get('category2')){
              this.Category2 = await this.masterDataService.getDocCat2(thisValue[0].id, true);
            }
          }else{
            if(this.locationFilters.get('sub-category')){
              this.filters.find(filter => filter.type === 'sub-category').value = [];
            }
            this.Category2 = [];
            this.selectedCategory2 = [];
          }
          break;
      
      case 'zones':
        if(thisValue?.length){
          let zoneIds:number[] = [];
          thisValue.forEach(filter => zoneIds.push(filter.id));
          if(this.locationFilters.get('zones')){
            this.filters.find(filter => filter.type === 'zones').value = thisValue;
            this.onFilterUpdated.emit(true);
          }
          if(this.locationFilters.get('states')){
            this.states = await this.masterDataService.getStatesByZones(zoneIds, true);
          }
        }else{
          if(this.locationFilters.get('zones')){
            this.filters.find(filter => filter.type === 'zones').value = [];
          }
          this.states = [];
          this.selectedStates = [];
        }
        // if(this.locationFilters.get('zones')){
        //   this.areaOffices = [];
        //   this.selectedAreaOffices = [];
        // }
        
        break;
      case 'states':
        if(thisValue?.length){
          let stateIds: number[] = [];
          thisValue.forEach(filter => stateIds.push(filter.id));
          if(this.locationFilters.get('states')){
            this.filters.find(filter => filter.type === 'states').value = thisValue;
            this.onFilterUpdated.emit(true);
          }
          if(this.locationFilters.get('areaOffices')){
            this.areaOffices = await this.masterDataService.getAreasByStates(stateIds, true);
          }
        }else{
          if(this.locationFilters.get('states')){
            this.filters.find(filter => filter.type === 'states').value = [];
          }
          this.areaOffices = [];
          this.selectedAreaOffices = [];
          
        }
        break; 
        case 'statesByAreaOffice':
          if(thisValue?.length){
            let stateIds: number[] = [];
           
              this.filters.find(filter => filter.type === 'statesByAreaOffice').value = thisValue;
              this.onFilterUpdated.emit(true);
           
            thisValue.forEach(filter => stateIds.push(filter.id));
            if(this.locationFilters.get('areaOfficesSingleSelect')){
              this.areaOffices = await this.masterDataService.getAreasByStates(stateIds, true);
            }
          }else{
            this.areaOffices = [];
            this.selectedAreaOffices = [];
          }
          break;
          case 'areaOfficesSingleSelect':
            if(thisValue?.length){
              let stateIds: number[] = [];
             
                this.filters.find(filter => filter.type === 'areaOfficesSingleSelect').value = thisValue;
                this.onFilterUpdated.emit(true);
             
             
            }else{
              this.areaOffices = [];
              this.selectedAreaOffices = [];
            }
            break;
      case 'area':
        if(thisValue?.length){
          let areaIds: number[] = [];
          thisValue.forEach(filter => areaIds.push(filter.id));
          this.filters.find(filter => filter.type === 'areaOffices').value = thisValue;
          if(this.locationFilters.get('district')){
            this.district = await this.masterDataService.getDistrictByAreas(areaIds, true);
          }
          this.onFilterUpdated.emit(true);
        }else{
          if(this.locationFilters.get('areaOffices')){
            this.filters.find(filter => filter.type === 'areaOffices').value = [];
          }
          this.district = [];
          this.selectedDistrict = [];
        }
        break;
        case 'district':
          if(thisValue?.length){
            let areaIds: number[] = [];
            thisValue.forEach(filter => areaIds.push(filter.id));
            this.filters.find(filter => filter.type === 'district').value = thisValue;
            if(this.locationFilters.get('teshil')){
              this.teshil = await this.masterDataService.getTehsilByDistricts(areaIds, true);
            }
            this.onFilterUpdated.emit(true);
          }else{
            if(this.locationFilters.get('district')){
              this.filters.find(filter => filter.type === 'district').value = [];
            }
            this.teshil = [];
            this.selectedTeshil = [];
          }
          break;
          case 'teshil':
            if(thisValue?.length){
              let areaIds: number[] = [];
              thisValue.forEach(filter => areaIds.push(filter.id));
              this.filters.find(filter => filter.type === 'teshil').value = thisValue;
              if(this.locationFilters.get('village')){
                this.village = await this.masterDataService.getVillageByTehsils(areaIds, true);
              }
              this.onFilterUpdated.emit(true);
            }else{
              if(this.locationFilters.get('teshil')){
                this.filters.find(filter => filter.type === 'teshil').value = [];
              }
              this.village = [];
              this.selectedVillage = [];
            }
          break;
          case 'village':
            if(thisValue?.length){
              let villageIds: number[] = [];
              thisValue.forEach(filter => villageIds.push(filter.id));
              this.filters.find(filter => filter.type === 'village').value = thisValue;
              
              this.onFilterUpdated.emit(true);
            }else{
              if(this.locationFilters.get('village')){
                this.filters.find(filter => filter.type === 'village').value = [];
              }
              
            }
          break;
      default:
        break;
    }
    if(!thisValue?.length){
      console.log('log',thisValue)
      this.filtersChanged(null,null);
    }
  }
  async onViceVersaLocationFilterChanged(filterType: string,thisValue: MasterDataModel[]){
    switch(filterType){
      case 'viceVersaCountry':
        if(thisValue?.length){
          if(this.viceVersaLocationFilters.get('viceVersaCountry')){
            this.filters.find(filter => filter.type === 'viceVersaCountry').value = thisValue;
            this.onFilterUpdated.emit(true);
          }
          if(this.viceVersaLocationFilters.get('viceVersaZones')){
            this.viceVersaZones = await this.masterDataService.getZonesByCountry(thisValue[0].id, true);
            if (this.viceVersaZones && !this.userService.isVendor())
            // this.viceVersaZones = this.viceVersaZones?.filter(o1 => this.userViewModel.zones.some(o2 => o1.id === o2.id));

            if (this.selectedViceVersaStates && this.viceVersaStates && !this.userService.isVendor() )
            this.selectedViceVersaStates = this.selectedViceVersaStates?.filter(o1 => this.viceVersaStates.some(o2 => o1.id === o2.id));
            if(this.selectedViceVersaZones == null || this.selectedViceVersaZones?.length == 0 )
            {
              this.viceVersaStates = [];
              this.viceVersaAreaOffices = [];
              this.selectedViceVersaAreaOffices = [];
            }
            
          }
        }else{
          if(this.viceVersaLocationFilters.get('viceVersaCountry')){
            this.filters.find(filter => filter.type === 'viceVersaCountry').value = [];
          }
          this.viceVersaZones = [];
          this.selectedViceVersaZones = [];
          this.viceVersaStates = [];
          this.selectedViceVersaStates = [];
          this.viceVersaAreaOffices = [];
          this.selectedViceVersaAreaOffices = [];
        }
       
        if ((this.userService.isVendor()) && ( this.selectedViceVersaCountry  == null ||this.selectedViceVersaCountry?.length ==0)  ) {
          if(!this.userService.isVendor())
          {
            // this.viceVersaCountries = [this.userViewModel.country];
            // this.viceVersaZones = this.userViewModel.zones;
            // this.viceVersaAreaOffices = this.userViewModel.areas;
            // this.viceVersaStates = this.userViewModel.states;
          }
         
          if(this.userService.isVendor())
          {
            this.viceVersaCountries =  [this.vcountry];
            this.viceVersaZones = this.vzones ;
            this.viceVersaAreaOffices = this.vareas;
            this.viceVersaStates = this.vstates;
          
  
          }
        }
        break;
      case 'viceVersaZones':
        if(thisValue?.length){
          let zoneIds:number[] = [];
          thisValue.forEach(filter => zoneIds.push(filter.id));
          if(this.viceVersaLocationFilters.get('viceVersaZones')){
            this.filters.find(filter => filter.type === 'viceVersaZones').value = thisValue;
            this.onFilterUpdated.emit(true);
          }
          if(this.viceVersaLocationFilters.get('viceVersaZones')){
            this.viceVersaStates = await this.masterDataService.getStatesByZones(zoneIds, true);
          
          }
          if( (this.userService.isVendor()) && ( this.selectedViceVersaCountry  == null ||this.selectedViceVersaCountry?.length ==0)  )
          {
            if(!this.userService.isVendor())
            {
            // this.selectedViceVersaCountry = [this.userViewModel.country];
            }
            else if(this.userService.isVendor()){
              this.selectedViceVersaCountry = [this.vcountry];
            }
          }
          if (this.viceVersaAreaOffices && this.selectedViceVersaAreaOffices )
          this.selectedViceVersaAreaOffices = this.selectedViceVersaAreaOffices?.filter(o1 => this.viceVersaAreaOffices.some(o2 => o1.id === o2.id));
          if(this.selectedViceVersaStates == null || this.selectedViceVersaStates?.length == 0 )
          {
            this.viceVersaAreaOffices = [];
          }
        }else{
          if(this.viceVersaLocationFilters.get('viceVersaZones')){
            this.filters.find(filter => filter.type === 'viceVersaZones').value = [];
          }
          this.selectedViceVersaStates = [];
          this.viceVersaStates = [];
          this.viceVersaAreaOffices = [];
         this.selectedViceVersaAreaOffices = [];
        }
        
        if ((this.userService.isVendor()) && ( this.selectedViceVersaCountry  == null ||this.selectedViceVersaCountry?.length ==0) ) {
          if(!this.userService.isVendor())
          {
          // this.viceVersaCountries = [this.userViewModel.country];
          // this.viceVersaZones = this.userViewModel.zones;
          // this.viceVersaAreaOffices = this.userViewModel.areas;
          // this.viceVersaStates = this.userViewModel.states;
          }
          if(this.userService.isVendor())
          {
            
            this.viceVersaCountries =  [this.vcountry];
            this.viceVersaZones = this.vzones ;
            this.viceVersaAreaOffices = this.vareas;
            this.viceVersaStates = this.vstates;
          
  
          }
        }
        break;
      case 'viceVersaStates':
        if(thisValue?.length){
          let stateIds: number[] = [];
          thisValue.forEach(filter => stateIds.push(filter.id));
          if(this.viceVersaLocationFilters.get('viceVersaStates')){
            this.filters.find(filter => filter.type === 'viceVersaStates').value = thisValue;
            this.onFilterUpdated.emit(true);
          }
          if(this.viceVersaLocationFilters.get('viceVersaAreaOffices')){
            this.viceVersaAreaOffices = await this.masterDataService.getAreasByStates(stateIds, true);
            // if (this.viceVersaAreaOffices && !this.userService.isVendor())
          }
          if( (this.userService.isVendor()) && ( this.selectedViceVersaCountry  == null ||this.selectedViceVersaCountry?.length ==0)  )
          {
  
            this.selectedViceVersaZones = await this.masterDataService.getZonesByStates(stateIds, true);
            if(!this.userService.isVendor())
            {
            // this.selectedViceVersaCountry = [this.userViewModel.country];
            }
            else if(this.userService.isVendor()){
              this.selectedViceVersaCountry = [this.vcountry];
            }
            
          }
        }else{
          if(this.viceVersaLocationFilters.get('viceVersaStates') ){
            this.filters.find(filter => filter.type === 'viceVersaStates').value = [];
          }
          this.viceVersaAreaOffices = [];
          this.selectedViceVersaAreaOffices = [];
        }
        if ((this.userService.isVendor()) && ( this.selectedViceVersaCountry  == null ||this.selectedViceVersaCountry?.length ==0) ) {
          if(!this.userService.isVendor())
          {
          // this.viceVersaCountries = [this.userViewModel.country];
          // this.viceVersaZones = this.userViewModel.zones;
          // this.viceVersaAreaOffices = this.userViewModel.areas;
          // this.viceVersaStates = this.userViewModel.states;
          }
          if(this.userService.isVendor())
          {
            this.viceVersaCountries =  [this.vcountry];
            this.viceVersaZones = this.vzones ;
            this.viceVersaAreaOffices = this.vareas;
            this.viceVersaStates = this.vstates;
          
  
          }
        }
        break; 
      case 'viceVersaAreaOffices':
        if(thisValue?.length){
          let areaIds: number[] = [];
          thisValue.forEach(filter => areaIds.push(filter.id));
          this.filters.find(filter => filter.type === 'viceVersaAreaOffices').value = thisValue;
          if( (this.userService.isVendor())  && ( this.selectedViceVersaCountry  == null ||this.selectedViceVersaCountry?.length ==0)  )
          {
            
            this.selectedViceVersaStates = await this.masterDataService.getStatesByArea(areaIds,true);
          }
          this.onFilterUpdated.emit(true);
        }else{
          if(this.viceVersaLocationFilters.get('viceVersaAreaOffices')){
            this.filters.find(filter => filter.type === 'viceVersaAreaOffices').value = [];
          }
        }
      
        if ( ( this.selectedViceVersaCountry  == null ||this.selectedViceVersaCountry?.length ==0) ) {
          if(!this.userService.isVendor())
          {
          // this.viceVersaCountries = [this.userViewModel.country];
          // this.viceVersaZones = this.userViewModel.zones;
          // this.viceVersaAreaOffices = this.userViewModel.areas;
          // this.viceVersaStates = this.userViewModel.states;
          }
          if(this.userService.isVendor())
          {
            this.viceVersaCountries =  [this.vcountry];
            this.viceVersaZones = this.vzones ;
            this.viceVersaAreaOffices = this.vareas;
            this.viceVersaStates = this.vstates;
          }
        }
        break;
      default:
        break;
    }
    if(!thisValue?.length){
      this.filtersChanged(null,null);
    }
  }


  clearFilter(){
    this.filters.forEach(filter => {
      delete filter.value
      filter.value=[];
      if(filter.type == 'slider')
      {
        filter.maxValue = 100;
        filter.minValue = 0;
      }
     
    })
    this.selectedStates = [];
    this.selectedCountry = [];
    this.selectedZones = [];
    this.selectedAreaOffices = [];
    this.selectedViceVersaCountry =[];
    this.selectedViceVersaStates =[];
    this.selectedViceVersaZones =[];
    this.selectedViceVersaAreaOffices =[];
    this.selectedStatesByArea =[];
    this.selectedDistrict = [];
    this.selectedTeshil =[];
    this.selectedVillage =[];
    this.selectedRegion =[];
    this.selectedMarketNew =[];
    this.selectedDealer =[];
    this.selectedFileType = [];
    this.selectedSubRegion =[];
    this.selectedCategory =[];
    this.selectedSubCategory = [];
    this.selectedApproval =[];
    this.selectedCategory2=[];
    this.selectedYear=[];
    this.approval=[];
    this.selectedDivision =[];
    this.selectedRole =[];
    this.selectedStatusOrder = [];
    this.selectedOrderType = [];
    this.selectedDealerReport=[];
    this.showComponent = false;
    this.cdr.detectChanges();
    this.showComponent = true;
    this.selectedFilters = false;
    this.onFilterUpdated.emit(this.selectedFilters);
    
  }

  closeFilter(){
    this.clearFilter();
    this.onClose.emit();
    this.onFilterUpdated.emit(this.selectedFilters);
  }
  selectedFilters = false;
  filtersChanged(value:any, type: string){
    this.selectedFilters = this.filters.filter(filter => filter.value?.length && filter.field!== type).length>0;
    if(!this.selectedFilters && value!=null && (!Array.isArray(value) || (Array.isArray(value) && value?.length))){
      this.selectedFilters = true;
    }
   
    this.onFilterUpdated.emit(this.selectedFilters);
  }

  onFilter(){
    if(this.filters[0].type=="marketnew"){
      if(this.filters[1].value.length>0){
     
        this.onFilterButtonClick.emit(this.filters);
      }else{
        this.alertService.show("Please Select Dealer");

      }
    }else{
      console.log('filetr Compioenet',this.filters)
      this.onFilterButtonClick.emit(this.filters);
    }
    
  }
  sliderChanged(index:number)
  {
    if(index && index != null)
    {
       
      this.filters[index].value= [this.filters[index].minValue,this.filters[index].maxValue];
      this.filtersChanged( this.filters[index].value,this.filters[index].type);
    }
  }

}
