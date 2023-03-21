import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { RoleService } from '../../../services/role-management.service';
import { UsermanagementService } from '../../../services/usermanagement.service';
import { userAccessControlContent } from '../user-management.js';

@Component({
  selector: 'jd-user-access-control',
  templateUrl: './user-access-control.component.html',
  styleUrls: ['./user-access-control.component.scss']
})
export class UserAccessControlComponent implements OnInit {
  @Input('getRacfDetails') getRacfDetails: any = [];
  @Input('getUserDetails') getUserDetails: any = [];
  @Output() closed = new EventEmitter();
  pageContent: any = {};
  activeIndex = 1;
  uploadStepContent: any = [];
  uploadStepForm: FormGroup;
  downloadStepContent: any = [];
  downloadStepForm: FormGroup;
  viewStepContent: any = [];
  viewStepForm: FormGroup;
  resData: any = [];
  isEdit: boolean = false;
  userRacfId: any = '';
  resDataView: any = [];
  
  options = {
    regionOptions: [],
    regionSelectedOptions: [],
    subRegionOptions: [],
    subRegionSelectedOptions: [],
    divionsOptions: [],
    divisionSelectedOptions: [],
    marketOptions: [],
    marketSelectedOptions: [],
    downloadRegionSelectedOptions: [],
    downloadSubRegionSelectedOptions: [],
    downloadDivisionSelectedOptions: [],
    downloadMarketSelectedOptions: [],
    viewRegionSelectedOptions: [],
    viewSubRegionSelectedOptions: [],
    viewDivisionSelectedOptions: [],
    viewMarketSelectedOptions: [],
  };

  dropdownSettings = {
    noDataLabel:'No Data Available',
    stopScrollPropagation: true,
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    text: 'Select',
    labelKey: 'name',
    primaryKey: 'id',
    enableCheckAll: true,
    badgeShowLimit: 1,
    allowSearchFilter: true,
    closeDropDownOnSelection: false,
    searchAutofocus: false,
    enableSearchFilter: true,
    showCheckbox: true,
    lazyLoading: false,
    maxHeight: 130,
    escapeToClose: true,
    autoPosition: false, 
    position:'bottom',
    tagToBody: true
  };

  constructor(
    private userservice: UsermanagementService,
    private alertService: AlertsService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.pageContent = userAccessControlContent;
    this.uploadStepContent = this.pageContent.uploadAccessForm;
    console.log("upload",this.uploadStepContent)
    this.isEdit = this.getUserDetails?.racfId ? true : false;
    this.userRacfId = this.getUserDetails?.racfId ? this.getUserDetails?.racfId : '';
    if(this.isEdit) {
      this.getRacfDetails.push({
        'racfId': this.getUserDetails?.racfId,
      })
      this.getDocumentAccessView();
    }
    this.setUploadAccessForm();
  }

  async getDocumentAccessView() {
    const params = this.getUserDetails?.racfId;
    this.resDataView = await this.userservice.getDocumentAccess(params);
  }

  navigateTab(step, index){
    this.activeIndex = step.active;
    if(this.activeIndex === 1) {
      this.uploadStepContent = this.pageContent.uploadAccessForm;
      this.setUploadAccessForm();
    } else if(this.activeIndex === 2) {
      this.downloadStepContent = this.pageContent.downloadAccessForm;
      this.setDownloadAccessForm();
    } else {
      this.viewStepContent = this.pageContent.viewAccessForm;
      this.setViewAccessForm();
    }
  }

  setUploadAccessForm(){
    this.uploadStepForm = this.formBuilder.group({});
    this.uploadStepContent?.formInputs?.forEach((f,i)=>{
      if(f?.model){
        f['dropdownSettings'] = this.dropdownSettings;
        let validators = [];
        if(f?.markAsRequired){
          validators.push(Validators.required);
        }
        this.uploadStepForm.addControl(f?.model, new FormControl([], validators));
      }
    });
    setTimeout(() => {
      this.getRegionAll(this.uploadStepContent, this.uploadStepForm);
    }, 300);
  }

  setDownloadAccessForm() {
    this.downloadStepForm = this.formBuilder.group({});    
    this.downloadStepContent?.formInputs?.forEach((f,i)=>{
      if(f?.model){
        f['dropdownSettings'] = this.dropdownSettings;
        let validators = [];
        if(f?.markAsRequired){
          validators.push(Validators.required);
        }
        this.downloadStepForm.addControl(f?.model, new FormControl([], validators));
      }
    });
    this.getRegionAll(this.downloadStepContent, this.downloadStepForm);
  }

  setViewAccessForm() {
    this.viewStepForm = this.formBuilder.group({});
    this.viewStepContent?.formInputs?.forEach((f,i)=>{
      if(f?.model){
        f['dropdownSettings'] = this.dropdownSettings;
        let validators = [];
        if(f?.markAsRequired){
          validators.push(Validators.required);
        }
        this.viewStepForm.addControl(f?.model, new FormControl([], validators));
      }
    });
    this.getRegionAll(this.viewStepContent, this.viewStepForm);
  }

  async initializeData() {
    try{
      this.getRegionAll();
    }catch (error) {
      console.error(error);
    }
  }

  async getRegionAll(activeFormContent?, activeFormGroup?) {
    let formItem = activeFormContent.formInputs[0];
    this.options[formItem.options] = await this.userservice.getRegion(true)
    this.options[formItem.options].map((item:any)=> {
      if(item.id) {
        item['id'] = parseInt(item.id);
      }
    });

    this.options[formItem.selectedOptions] = this.options[formItem.options];
    
    let params = [];
    let formItemSubRegion = activeFormContent.formInputs[1];
    let formItemDivision = activeFormContent.formInputs[2];
    let formItemMarkets = activeFormContent.formInputs[3];
    if(this.isEdit) {
      activeFormGroup.get(formItem.model).patchValue(this.options[formItem.selectedOptions]);
      activeFormGroup.get(formItemSubRegion.model).patchValue([]);
      activeFormGroup.get(formItemDivision.model).patchValue([]);
      activeFormGroup.get(formItemMarkets.model).patchValue([]);
    }
    let flagParams = [];
    flagParams['isOnload'] = this.isEdit ? true : false;
    flagParams['subModuleFlag'] = activeFormContent.subModuleSlug;
    flagParams['activeFormGroup'] = activeFormGroup;
    this.loadSubByRegions(params, formItemSubRegion, flagParams);
    this.loadDivBySub(params, formItemDivision, flagParams);
    this.loadCountryByDiv(params, formItemMarkets, flagParams);
  }

  onItemSelect(formField, params?, activeAccessForm?, index?){
    if (formField?.isChangeEvent) {
      let formItem = [];
      let nextFormItem = [];
      let nextIndex = 0;
      activeAccessForm?.formInputs?.map((item, i)=>{
        if(i === index) {
          nextIndex = index + 1;
          formItem = item;
        }
        if(nextIndex === i) {
          nextFormItem = item;
        }
      });
      let flagParams = [];
      flagParams['isOnload'] = false;
      flagParams['subModuleFlag'] = activeAccessForm.subModuleSlug;
      this[formField?.callBack](formItem, nextFormItem, flagParams);
    }
  }

  OnItemDeSelect(formField, params?, activeAccessForm?, index?){
    if (formField?.isChangeEvent) {
      let formItem = [];
      let nextFormItem = [];
      let nextIndex = 0;
      activeAccessForm?.formInputs?.map((item, i)=>{
        if(i === index) {
          nextIndex = index + 1;
          formItem = item;
        }
        if(nextIndex === i) {
          nextFormItem = item;
        }
      });
      let flagParams = [];
      flagParams['isOnload'] = false;
      flagParams['subModuleFlag'] = activeAccessForm.subModuleSlug;
      this[formField?.callBack](formItem, nextFormItem, flagParams);
    }
  }

  onSelectAll(formField, params?, activeAccessForm?, index?){
    if (formField?.isChangeEvent) {
      let formItem = [];
      let nextFormItem = [];
      let nextIndex = 0;
      activeAccessForm?.formInputs?.map((item, i)=>{
        if(i === index) {
          nextIndex = index + 1;
          formItem = item;
        }
        if(nextIndex === i) {
          nextFormItem = item;
        }
      });
      let flagParams = [];
      flagParams['isOnload'] = false;
      flagParams['subModuleFlag'] = activeAccessForm.subModuleSlug;
      this[formField?.callBack](formItem, nextFormItem, flagParams);
    }
  }

  onDeSelectAll(formField, params?, activeAccessForm?, index?){
    if (formField?.isChangeEvent) {
      let formItem = [];
      let nextFormItem = [];
      let nextIndex = 0;
      activeAccessForm.map((item, i)=>{
        if(i === index) {
          nextIndex = index + 1;
          formItem = item;
        }
        if(nextIndex === i) {
          nextFormItem = item;
        }
      });
      let flagParams = [];
      flagParams['isOnload'] = false;
      flagParams['subModuleFlag'] = activeAccessForm.subModuleSlug;
      this[formField?.callBack](formItem, nextFormItem, flagParams);
    }
  }

  async loadSubByRegions(formItem?, nextFormItem?, flagParams?) {
    var regionIds: {regionId: number}[] = [];
    this.options[formItem?.selectedOptions]?.forEach(x => {
      regionIds.push({regionId:x?.id});
    });
    if (regionIds?.length) {
      this.getSubRegionAll(regionIds, nextFormItem,flagParams);
    } else {
      this.getSubRegionAll(regionIds, nextFormItem,flagParams);
    }
  }

  async getSubRegionAll(regionIds?, formItem?, flagParams?){
    const params = this.getUserDetails?.racfId;
    this.resDataView = await this.userservice.getDocumentAccess(params);
    this.options[formItem.options] = await this.userservice.getSubRegion(regionIds, true);
    this.options[formItem.options] = this?.options[formItem?.options]?.sort((a, b) => (a?.name > b?.name) ? 1 : -1);
    this.options[formItem.options].map((item,i)=> {
      if(item.id) {
        item['id'] = parseInt(item.id);
      }
    });
    if(flagParams.isOnload) {
      this.resDataView?.data?.map((item, i)=>{
        if(item.subModuleSlug == flagParams.subModuleFlag) {
          item.subRegions.map((x,y)=> {
            this.options[formItem.options].map((f,i)=> {
              if(x.subRegionId === f.id) {
                this.options[formItem.selectedOptions].push({
                  id: f.id,
                  name: f.name,
                });
              }
            });
          });
        }
      });

      flagParams?.activeFormGroup?.get(formItem?.model).patchValue(this.options[formItem?.selectedOptions]);
      flagParams?.activeFormGroup?.get(formItem?.model).updateValueAndValidity();
      // flagParams?.activeFormGroup?.get(formItem?.model).markAsTouched();
    }
    else{
      this.options[formItem.selectedOptions] = null;
    }
  }

  async loadDivBySub(formItem?, nextFormItem?, flagParams?) {
    var subregionIds: {subRegionId: number}[] = []
    this.options[formItem?.selectedOptions]?.forEach(x => {
      subregionIds.push({subRegionId:x?.id});
    });
    if (subregionIds?.length) {
      this.getDivisionAll(subregionIds, nextFormItem, flagParams);
    } else {
      this.getDivisionAll(subregionIds, nextFormItem, flagParams);
    }
  }

  async getDivisionAll(subregionIds?, formItem?, flagParams?) {
    const params = this.getUserDetails?.racfId;
    this.resDataView = await this.userservice.getDocumentAccess(params);
    this.options[formItem.options] = await this.userservice.getDivision(subregionIds, true);
    this.options[formItem.options] = this?.options[formItem.options]?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
    this.options[formItem.options]?.map((item,i)=> {
      if(item.id) {
        item['id'] = parseInt(item.id);
      }
    });

    if(flagParams.isOnload) {
      this.resDataView?.data?.map((item, i)=>{
        if(item.subModuleSlug == flagParams.subModuleFlag) {
          item.divisions.map((x,y)=> {
            this.options[formItem.options].map((f,i)=> {
              if(x.divisionId === f.id) {
                this.options[formItem.selectedOptions].push({
                  id: f.id,
                  name: f.name,
                });
              }
            });
          });
        }
      });

      flagParams?.activeFormGroup?.get(formItem?.model).patchValue(this.options[formItem?.selectedOptions]);
      flagParams?.activeFormGroup?.get(formItem?.model).updateValueAndValidity();
      // flagParams?.activeFormGroup?.markAllAsTouched();
    }
    else{
      this.options[formItem.selectedOptions] = null;
    }
  }

  async loadCountryByDiv(formItem?, nextFormItem?, flagParams?) {
    var ids: {divisionId: number}[] = []
    this.options[formItem?.selectedOptions]?.forEach(x => {
      ids.push({divisionId:x?.id});
    });
    if (ids?.length) {
      this.getCountryAll(ids, nextFormItem, flagParams);
    } else {
      this.getCountryAll(ids, nextFormItem, flagParams);
    }
  }

  async getCountryAll(ids?, formItem?, flagParams?) {
    const params = this.getUserDetails?.racfId;
    this.resDataView = await this.userservice.getDocumentAccess(params);
    this.options[formItem.options] = await this.userservice.getCountry(ids, true);
    this.options[formItem.options] = this?.options[formItem.options]?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
    this.options[formItem.options].map((item,i)=> {
      if(item.id) {
        item['id'] = parseInt(item.id);
      }
    });

    // 
    if(flagParams.isOnload) {
      this.resDataView?.data?.map((item, i)=>{
        if(item.subModuleSlug == flagParams.subModuleFlag) {
          item.markets.map((x,y)=> {
            this.options[formItem.options].map((f,i)=> {
              if(x.marketId === f.id) {
                this.options[formItem.selectedOptions].push({
                  id: f.id,
                  name: f.name,
                });
              }
            });
          });
        }
      });

      flagParams?.activeFormGroup?.get(formItem?.model).patchValue(this.options[formItem?.selectedOptions]);
      flagParams?.activeFormGroup?.get(formItem?.model).updateValueAndValidity();
      // flagParams?.activeFormGroup?.markAllAsTouched();
    }
    else{
      this.options[formItem.selectedOptions] = null;
    }
  }

  async tabSubmitCall(activeFormContentValue, subModuleSlug){
    console.log("trigger",activeFormContentValue,subModuleSlug)
    const reqBody = [];
    const mappingList = [];
    const regions = [];
    const subRegions = [];
    const divisions = [];
    const markets = [];
    if(!activeFormContentValue?.valid){
      activeFormContentValue.markAllAsTouched();
      return;
    }
    activeFormContentValue.get('regions').value.map((item,i)=> {
      console.log("items",item)
      regions.push({
        regionId: item.id,
        regionName: item.name
      })
    });
    activeFormContentValue.get('subRegions').value.map((item,i)=> {
      subRegions.push({
        subRegionId: item.id,
        subRegionName: item.name
      })
    });
    activeFormContentValue.get('divisions').value.map((item,i)=> {
      divisions.push({
        divisionId: item.id,
        divisionName: item.name
      })
    });
    activeFormContentValue.get('markets').value.map((item,i)=> {
      markets.push({
        marketId: item.id,
        marketName: item.name
      })
    });
    
    mappingList.push({
      'subModuleSlug': subModuleSlug,
      regions,
      subRegions,
      divisions,
      markets
    });
    reqBody['userList'] = this.getRacfDetails;
    reqBody['mappingList'] = mappingList;

    console.log("req body",reqBody);
    this.resData = await this.userservice.setUserAccessControl(reqBody);

    if (ApiErrorUtil.isError(this.resData)) {
      this.alertService.show(ApiErrorUtil.errorMessage(this.resData), AlertType.Critical);
    } else {
      // activeFormContentValue.reset();
      if(this.resData?.message?.messageDescription.length) {
        this.alertService.show(this.resData?.message?.messageDescription);
      } else {
        this.alertService.show("Status Updated Successfully");
      }
    }
  }

  onClose(activeFormContentValue){
    activeFormContentValue.reset();
    this.closed.emit();
  }

}
