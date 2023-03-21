import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { VendorManagement } from '../../../models/vendor-management.model';
import { RoleService } from '../../../services/role-management.service';
import { UsermanagementService } from '../../../services/usermanagement.service';
import { VendormanagementService } from '../../../services/vendormanagement.service';
import { UserManagementModelMapper, UserManagementView} from '../../models/user-management-view.model';

@Component({
  selector: 'jd-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  title='';
  buttonText='';
  resetbutton='';
  loading = false;
  showDate=true;
  @Output() closed = new EventEmitter();
  roleOptions: { id: string, name: string }[] = [];
  curentStatus: string;
  @Input() model:UserManagementView;
  @ViewChild('addedituserform', { static: false }) form: NgForm;
  regionOptions: MasterDataModel[];
  selectedRegion: Array<{ id: number, name: string }>;
  subRegionOptions: MasterDataModel[] = [];
  dealerOptions:MasterDataModel[] = [];

  selectedSubRegion : Array<{ id: number, name: string }>;
  countryOptions: MasterDataModel[] = [];
  selectedCountry : Array<{ id: number, name: string }>;
  divisionOptions: MasterDataModel[] = [];
  saveedit="";
  isEdit: boolean;
  resticday=new Date()
  today=new Date()
  vendorIdSearch$ = new Subject<string>();
  showUserAccess: boolean = false;

  constructor(private masterDataService: MasterDataService,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private cdr: ChangeDetectorRef,private usermangement: UsermanagementService,
    private userService: UserService,
    private roleService: RoleService,

    ) { }

  async ngOnInit() {
    this.isEdit = this.model ? true : false;
    this.title = this.model ? 'Update Vendor' : 'Add Vendor';
    this.buttonText = this.model ? 'Update' : 'Submit';
    this.resetbutton = this.model ? 'Cancel' : 'Reset';
    this.model = this.model || {} as any;
    // this.model.address = this.model?.address || '';

    //this.roleOptions = await this.roleService.getActiveRoles();
    this.initializeData().then(x => { });
    
    //this.dateValidation()
  }
  async initializeData() {
    if(!this.isEdit){
      // this.model.isActive = 0;
    }
    this.roleOptions = await this.roleService.getRole()
    this.roleOptions = this?.roleOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
    this.curentStatus = this.model.activateFlag;
    this.model.regionId = this.model.regionId?.length && this.model.regionId || null;
    this.model.subRegionId = this.model.subRegionId?.length && this.model.subRegionId || null;
    this.model.country = this.model.country?.length && this.model.country || null;
    try{
      this.regionOptions = await this.usermangement.getRegion(true)
        if (this.regionOptions?.length == 1 && (this.model.regionId?.length == 0 || this.model.regionId == null)) {
          this.model.regionResponseDto = this.regionOptions;
        }
    }catch (error) {
      console.error(error);
    }
  }
  async loadSubByRegions(event:any) {
    var regionIds: {regionId: number}[] = []
    event?.forEach(x => {
      regionIds.push({regionId:x?.id});
    });
    if (event?.length) {
      this.subRegionOptions = await this.usermangement.getSubRegion(regionIds, true);
      this.subRegionOptions = this?.subRegionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)

      if (this.model.subRegionResponseDto && this.model.subRegionResponseDto?.length > 0) {
        if (this.subRegionOptions)
          this.model.subRegionResponseDto = this.model.subRegionResponseDto?.filter(o1 => this.subRegionOptions.some(o2 => o1.id === o2.id));
        if (!this.subRegionOptions) {
          if (this.subRegionOptions && this.subRegionOptions?.length == 1) {
            this.model.subRegionResponseDto = this.subRegionOptions;
          }
          else {
            this.model.subRegionResponseDto = null;

          }
          this.model.marketResponseDto = null;
        }
        this.loadDivBySub(this.model.subRegionResponseDto);
      }
      else {
        if (this.subRegionOptions && this.subRegionOptions?.length == 1 ) {
          this.model.subRegionResponseDto = this.subRegionOptions;
        }
        else {
          this.model.subRegionResponseDto = null;
        }
        this.loadDivBySub(this.model.subRegionResponseDto);
      }
    } else {
      this.subRegionOptions = await this.usermangement.getSubRegion(regionIds, true);
      this.subRegionOptions = this?.subRegionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      this.divisionOptions = null;
      //this.subRegionOptions = null;
      this.countryOptions = null;
      this.model.subRegionResponseDto = null;
      this.model.marketResponseDto = null;
      this.model.divisionResponseDto = null;
      if (this.model.subRegionResponseDto != null)
        this.model.subRegionResponseDto = null;
      this.loadDivBySub(this.model.subRegionResponseDto);
    }
  }
  async loaddealerByMarket(event:any){

    var ids: {marketId: number}[] = []
    event?.forEach(x => {
      ids.push({marketId:x?.id});
    });
    if (event?.length) {
      this.dealerOptions = await this.usermangement.getDealer(ids, true);
      this.dealerOptions = this?.dealerOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      if (this.model.dealerResponseDto && this.model.dealerResponseDto?.length > 0) {
        if (this.dealerOptions)
          this.model.dealerResponseDto = this.model.dealerResponseDto.filter(o1 => this.dealerOptions.some(o2 => o1.id === o2.id));
        if (!this.dealerOptions) {
          if (this.dealerOptions && this.dealerOptions?.length == 1) {
            this.model.dealerResponseDto = this.dealerOptions;
          }
          else {
            this.model.dealerResponseDto = null;

          }
        }
        
      }
    } else {
      this.dealerOptions = [];
      if (this.model.dealerResponseDto != null)
        this.model.dealerResponseDto = null;
    }
    
  }
  async loadDivBySub(event:any) {
    var subregionIds: {subRegionId: number}[] = []
    event?.forEach(x => {
      subregionIds.push({subRegionId:x?.id});
    });
    if (event?.length) {
      this.divisionOptions = await this.usermangement.getDivision(subregionIds, true);
      this.divisionOptions = this?.divisionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)

      if (this.model.divisionResponseDto && this.model.divisionResponseDto?.length > 0) {
        if (this.divisionOptions)
          this.model.divisionResponseDto = this.model.divisionResponseDto?.filter(o1 => this.divisionOptions.some(o2 => o1.id === o2.id));
        if (!this.divisionOptions) {
          if (this.divisionOptions && this.divisionOptions?.length == 1) {
            this.model.divisionResponseDto = this.divisionOptions;
          }
          else {
            this.model.divisionResponseDto = null;

          }
          this.model.marketResponseDto = null;
        }
        this.loadCountryByDiv(this.model.divisionResponseDto);
      }
      else {
        if (this.divisionOptions && this.divisionOptions?.length == 1 ) {
          this.model.divisionResponseDto = this.divisionOptions;
        }
        else {
          this.model.divisionResponseDto = null;
        }
        this.loadCountryByDiv(this.model.divisionResponseDto);
      }
    } else {
      this.divisionOptions = await this.usermangement.getDivision(subregionIds, true);
      this.divisionOptions = this?.divisionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      //this.divisionOptions = null;
      this.countryOptions = null;
      this.model.subRegionResponseDto = null;
      this.model.marketResponseDto = null;
      this.model.divisionResponseDto = null;
      if (this.model.divisionResponseDto != null)
        this.model.divisionResponseDto = null;
      this.loadCountryByDiv(this.model.divisionResponseDto);
    }
  }
  async loadCountryByDiv(event:any) {
    var ids: {divisionId: number}[] = []
    event?.forEach(x => {
      ids.push({divisionId:x?.id});
    });
    if (event?.length) {
      this.countryOptions = await this.usermangement.getCountry(ids, true);
      this.countryOptions = this?.countryOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      if (this.model.marketResponseDto && this.model.marketResponseDto?.length > 0) {
        if (this.countryOptions)
          this.model.marketResponseDto = this.model.marketResponseDto.filter(o1 => this.countryOptions.some(o2 => o1.id === o2.id));
        if (!this.countryOptions) {
          if (this.countryOptions && this.countryOptions?.length == 1) {
            this.model.marketResponseDto = this.countryOptions;
          }
          else {
            this.model.marketResponseDto = null;

          }
        }
      }
    } else {
      this.countryOptions = await this.usermangement.getCountry(ids, true);
      this.countryOptions = this?.countryOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      //this.countryOptions = [];
      if (this.model.marketResponseDto != null)
        this.model.marketResponseDto = null;
    }
  }
  onClose(){
    this.closed.emit();
  }
  onStatusChange(status: string) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'Active' ? 'Activate Vendor' : 'Deactivate Vendor',
        message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this vendor?`,
        okText: 'Yes',
        okCallback: async () => {
          this.modalService.publisher.next(null);
          resolve(true);
        },
        cancelText: 'No',
        cancelCallback: () => {
          this.model.status = status === 'Active' ? 'Inactive' : 'Active';
          this.modalService.publisher.next(null);
          resolve(false);
        },
        modalType: ModalType.warning,
        isSecondModal: true
      });
    });
  }

  onCreateUpdate(status: string,model:any,result:any) {
    console.log(status);
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'create' ? 'Create Vendor' : 'Update Vendor',
        message: `Are you sure you want to ${status === 'create' ? 'Create' : 'Update'} this vendor?`,
        okText: 'Yes',
        okCallback: async () => {
          if(status === 'create')
          result = await this.usermangement.create(model);
          else
          result = await this.usermangement.update(model);
          // if (ApiErrorUtil.isError(result)) {
          // console.log("result",result);
          //   this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          if (!result.data) {
            this.alertService.show(result.errorResponse.errorMessage, AlertType.Critical);
          } else {
            if(result?.message?.messageDescription.length)
              this.alertService.show(result?.message?.messageDescription );
            else
              this.alertService.show("Status Updated Successfully");
            this.onClose();
          }
          this.modalService.publisher.next(null);
          resolve(true);
        },
        cancelText: 'No',
        cancelCallback: () => {
          // this.model.status = status === 'Active' ? 'Inactive' : 'Active';
          this.modalService.publisher.next(null);
          resolve(false);
        },
        modalType: ModalType.warning,
        isSecondModal: true
      });
    });
  }


  async onsave(){
    this.form.form.markAllAsTouched();
    if (!this.form.valid) {
    // if (!this.form.valid) {
      return;
    }
   
    try {
      const model = UserManagementModelMapper.mapToModel(this.model,this.userService);
      let result: ApiResponse<VendorManagement>;
      if (this.isEdit) {
        let res;
        if (this.curentStatus !== this.model.activateFlag) {
          res = await this.onStatusChange(this.model.activateFlag);
          
          if (!res) {
            return;
          }
        }
        this.loading = true;
        await this.onCreateUpdate("update",model,result);
        // result = await this.docService.update(model);
      } else {
        //model.activateFlag = 1;
        await this.onCreateUpdate("create",model,result);
        
        // result = await this.docService.create(model);
      }
      // if (ApiErrorUtil.isError(result)) {
      //     this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
        
      // } else {
      //   if(result?.message?.messageDescription.length){
      //     this.alertService.show(result?.message?.messageDescription );
      //   }
      //   else
      //     this.alertService.show("Status Updated Successfully");
      //     // window.location.href = '';
      //   this.onClose()
      // }
    } catch (error) {
      if(this.isEdit){
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Vendor ', AlertType.Critical);

      }else{
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add Vendor ', AlertType.Critical);

      }
    }
    this.loading = false;
  }

  onClear() {
    this.onClose();
    //window.location.href = '/admin/email-master'
   }
   uploadDownloadViewAcessControl() {
    this.showUserAccess = true;
  }

  onCloseAcessControl(e:any){
    this.showUserAccess = false;
  }
}
