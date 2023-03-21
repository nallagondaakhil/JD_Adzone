import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { ManageProductMasterModel } from '../../../models/manage-product-master.model';
import { ManageProductService } from '../../../services/manage-product.service';
import { ManageProductModelMapper, ManageProductView } from '../../models/manage-product-view.model';

@Component({
  selector: 'jd-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {
  title = '';
  buttonText='';
  loading = false;
  isEdit:boolean;
  docOptions: MasterDataModel[] = [];
  showUpload = false;
  @Output() closed = new EventEmitter();
  curentStatus: string;
  fileUplodExtention = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png','mp4'];
  docFn: any;
  docthumb:any;
  currentDate= new Date();
  pastDate: boolean = false;
  oldExpiryDate: string;
  @ViewChild('documentType', { static: false }) form: NgForm;
  @Input() model: ManageProductView;
  //@Input() editData:ManageProductView; 
  isNotFile = true;
  isNotFile1 = true;
  uploadedDocs: {fileName: string, fileUrl: string, fileId?:number}[];
  thumbnailDocs: {fileName: string, fileUrl: string, fileId?:string}[];
  regionOptions: MasterDataModel[];
  subRegionOptions: MasterDataModel[] = [];
  countryOptions: MasterDataModel[] = [];
  category1Options: MasterDataModel[] = [];
  category2Options: Array<{ id: number, name: string }> = [];
  divisionOptions: MasterDataModel[] = [];
  thumbnailFile: {fileName?: string, fileUrl?: string, fileId?:string}[];
  uploadedFile: {fileName?: string, fileUrl?: string, fileId?:number}[];
  showAddModal = false;
  constructor(
    private alertService: AlertsService,
    private modalService: ModalDialogService,
    private productService: ManageProductService,
    private masterDataService: MasterDataService,
    private userService:UserService,
    private router:Router
  ) { 
    //this.docFn = this.productService.uploadFiles.bind(this.productService);
    this.docFn = this.productService.uploadFiles.bind(this.productService);
    this.docthumb = this.productService.uploadthumbFiles.bind(this.productService);
  }

  async ngOnInit(): Promise<void> {
    this.currentDate.setHours(0,0,0,0);
    this.isEdit = this.model ? true : false;
    this.title = this.model ? 'Update Printable Material' : 'Add Printable Material';
    this.buttonText = this.model ? 'Update' : 'Next';
    this.model = this.model || {} as any;
    this.model.documentName = this.model?.documentName || ''; 
    this.model.expiryDate = this.model?.expiryDate || null; 
    console.log(this.model);
    this.initializeData().then(x => { });
  }
  async initializeData() {
    
    
    this.curentStatus = this.model.activeFlag;
    this.model.regionId = this.model.regionId?.length && this.model.regionId || null;
    this.model.subRegions = this.model.subRegions?.length && this.model.subRegions || null;
    this.model.countries = this.model.countries?.length && this.model.countries || null;
    this.model.documentCategoryId = this.model.documentCategoryId?.length && this.model.documentCategoryId || null;
    this.model.documentSubChildCategoryId = this.model.documentSubChildCategoryId?.length && this.model.documentSubChildCategoryId || null;

    try{
      this.docOptions = await this.productService.getDocCategory(true);
      this.docOptions = this?.docOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      this.regionOptions = await this.productService.getRegion(true)
        if (this.regionOptions?.length == 1 && (this.model.regionId?.length == 0 || this.model.regionId == null)) {
          this.model.regions = this.regionOptions;
        }
    }catch (error) {
      console.error(error);
    }
    //if(this.isEdit)
    //{
      const editdata = this.model;
      this.model = editdata[0] || {} as any;
    //}
    if(this.isEdit){
      if(this.model.expiryDate && this.model.expiryDate.length){
        if(this.model.expiryDate[0] < [this.currentDate][0]){
          this.pastDate = true;
          this.oldExpiryDate = this.formatDate(this?.model?.expiryDate[0])
        }
      }
      this.uploadedFile = this.model.uploadedDocs || null;
      this.uploadedFile? this.isNotFile = false : this.isNotFile = true;
      this.thumbnailFile = this.model.thumbnailDocs || null;
      this.thumbnailFile? this.isNotFile1 = false : this.isNotFile1 = true;
      if(this.model?.documentSubChildCategoryId[0].id == null)
        this.model.documentSubChildCategoryId = null;
    }
    
  }
  changeExpiry(){
    if(this.pastDate && this.model.expiryDate.length){
      this.pastDate = false;
    }
  }
  async loadSubByRegions(event:any) {
    var regionIds: {regionId: number}[] = []
    event?.forEach(x => {
      regionIds.push({regionId:x?.id});
    });
    if (event?.length) {
      this.subRegionOptions = await this.productService.getSubRegion(regionIds, true);
      this.subRegionOptions = this?.subRegionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      if (this.model.subRegions && this.model.subRegions?.length > 0) {
        if (this.subRegionOptions)
          this.model.subRegions = this.model.subRegions?.filter(o1 => this.subRegionOptions.some(o2 => o1.id === o2.id));
        if (!this.subRegionOptions) {
          if (this.subRegionOptions && this.subRegionOptions?.length == 1) {
            this.model.subRegions = this.subRegionOptions;
          }
          else {
            this.model.subRegions = null;

          }
          this.model.countries = null;
        }
        this.loadDivBySub(this.model.subRegions);
      }
      else {
        if (this.subRegionOptions && this.subRegionOptions?.length == 1 ) {
          this.model.subRegions = this.subRegionOptions;
        }
        else {
          this.model.subRegions = null;
        }
        this.loadDivBySub(this.model.subRegions);
      }
    } else {
      this.divisionOptions = null;
      this.subRegionOptions = null;
      this.countryOptions = null;
      this.model.subRegions = null;
      this.model.countries = null;
      this.model.divisions = null;
      if (this.model.subRegions != null)
        this.model.subRegions = null;
      this.loadDivBySub(this.model.subRegions);
    }
  }
  async loadDivBySub(event:any) {
    var subregionIds: {subRegionId: number}[] = []
    event?.forEach(x => {
      subregionIds.push({subRegionId:x?.id});
    });
    if (event?.length) {
      this.divisionOptions = await this.productService.getDivision(subregionIds, true);
      this.divisionOptions = this?.divisionOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      if (this.model.divisions && this.model.divisions?.length > 0) {
        if (this.divisionOptions)
          this.model.divisions = this.model.divisions?.filter(o1 => this.divisionOptions.some(o2 => o1.id === o2.id));
        if (!this.divisionOptions) {
          if (this.divisionOptions && this.divisionOptions?.length == 1) {
            this.model.divisions = this.divisionOptions;
          }
          else {
            this.model.divisions = null;

          }
          this.model.countries = null;
        }
        this.loadCountryByDiv(this.model.divisions);
      }
      else {
        if (this.divisionOptions && this.divisionOptions?.length == 1 ) {
          this.model.divisions = this.divisionOptions;
        }
        else {
          this.model.divisions = null;
        }
        this.loadCountryByDiv(this.model.divisions);
      }
    } else {
      this.divisionOptions = null;
      this.countryOptions = null;
      this.model.subRegions = null;
      this.model.countries = null;
      this.model.divisions = null;
      if (this.model.divisions != null)
        // this.model.divisions = null;
      this.loadCountryByDiv(this.model.divisions);
    }
  }
  async loadCountryByDiv(event:any) {
    var ids: {divisionId: number}[] = []
    event?.forEach(x => {
      ids.push({divisionId:x?.id});
    });
    if (event?.length) {
      this.countryOptions = await this.productService.getCountry(ids, true);
      this.countryOptions = this?.countryOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      if (this.model.countries && this.model.countries?.length > 0) {
        if (this.countryOptions)
          this.model.countries = this.model.countries.filter(o1 => this.countryOptions.some(o2 => o1.id === o2.id));
        if (!this.countryOptions) {
          if (this.countryOptions && this.countryOptions?.length == 1) {
            this.model.countries = this.countryOptions;
          }
          else {
            this.model.countries = null;

          }
        }
      }
    } else {
      this.countryOptions = [];
      if (this.model.countries != null)
        this.model.countries = null;
    }
  }
  async loadCat1ByDoc(event:any){
    if (event?.length) {
      let docId:number;
      this.category1Options = await this.productService.getDocCat1(event[0].id, true);
      this.category1Options = this?.category1Options?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)

      if (event && event?.length > 0) {
        if (this.category1Options)
          this.model.documentSubCategoryId = this.model.documentSubCategoryId?.filter(o1 => this.category1Options.some(o2 => o1.id === o2.id));
        if (!this.category1Options) {
          if (this.category1Options && this.category1Options?.length == 1) {
            this.model.documentSubCategoryId = this.category1Options;
          }
          else {
            this.model.documentSubCategoryId = null;

          }
          this.model.documentSubChildCategoryId = null;
        }
      }
      else {
        if (this.category1Options && this.category1Options?.length == 1 ) {
          this.model.documentSubCategoryId = this.category1Options;
        }
        else {
          this.model.documentSubCategoryId = null;
        }
        this.loadCat2ByCat1(this.model.documentSubCategoryId);
      }
    } else {
      this.category1Options = null;
      this.category2Options = null;
      if (this.model.documentSubCategoryId != null)
        this.model.documentSubCategoryId = null;
      this.loadCat2ByCat1(this.model.documentSubCategoryId);
    }
    // this.model.documentSubChildCategoryId = null;
    
  }

  async loadCat2ByCat1(event:any){
    
    if (event?.length) {
      let docId:number;
      this.category2Options = await this.productService.getDocCat2(event[0].id, true);
      this.category2Options = this?.category2Options?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)

      if (event && event?.length > 0) {
        if (!this.category2Options) {
          if (this.category2Options && this.category2Options?.length == 1) {
            this.model.documentSubChildCategoryId = this.category2Options;
          }
          else {
            this.model.documentSubChildCategoryId = null;
          }
          // this.model.documentSubChildCategoryId = null;
        }
      }
      else {
        if (this.category2Options && this.category2Options?.length == 1 ) {
          this.model.documentSubChildCategoryId = this.category2Options;
        }
        else {
          this.model.documentSubChildCategoryId = null;
        }
      }
    } else {
      // this.category1Options = null;
      // this.category2Options = null;
      if (this.model.documentSubCategoryId != null)
        this.model.documentSubCategoryId = null;
    }
    // this.model.documentSubChildCategoryId = null;
  }
  onUpload(files: {fileName: string, fileUrl: string}[]) {
    files = files || [];
    this.model.uploadedDocs = files;
    if (this.model.uploadedDocs.length > 0) {
      this.isNotFile = false;
    }
  }
  onthumbUpload(files: {fileName: string, fileUrl: string}[]) {
    files = files || [];
    this.model.thumbnailDocs = files;
    if (this.model.thumbnailDocs.length > 0) {
      this.isNotFile1 = false;
    }
  }
  onClose() {
    this.closed.emit();
  }
  onClear() {
    this.onClose();
   }
   onSubmit(){
    if(this.model?.uploadedDocs?.length > 0){
      if(!this.isEdit)
      this.alertService.show("Printable Material Added Successfully");
      // this.onClose();
      this.showAddModal=true;
      this.reloadComponent();
    }else{
      this.alertService.show("File is required.", AlertType.Critical);
    }
    
  }
  onCloseUploadModal(e:any){
    this.showUpload = false;
    //this.dataTable.redrawGrid();
  }
  onStatusChange(status: string) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'Active' ? 'Activate User' : 'Deactivate Printable Material',
        message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this printable material?`,
        okText: 'Yes',
        okCallback: async () => {
          this.modalService.publisher.next(null);
          resolve(true);
        },
        cancelText: 'No',
        cancelCallback: () => {
          this.modalService.publisher.next(null);
          resolve(false);
        },
        modalType: ModalType.warning,
        isSecondModal: true
      });
    });
  }
  onCreateUpdate(status: string,model:any,result:any) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'create' ? 'Create Product' : 'Update Printable Material',
        message: `Are you sure you want to ${status === 'create' ? 'Create' : 'Update'} this printable material?`,
        okText: 'Yes',
        okCallback: async () => {
          if(status === 'create'){
            result = await this.productService.create(model);
            this.model.documentId = result?.data?.documentId;
            this.showUpload = true;
          }
          else{
            result = await this.productService.update(model);
            // this.onClose();
            // window.location.href = '/master/manage-product';
          }
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            if(result?.message?.messageDescription.length)
              this.alertService.show(result?.message?.messageDescription );
            else
              this.alertService.show("Status Updated Successfully");
            // this.onClose();
            window.location.href = '/master/manage-product';
            this.onClose();
          }
          this.modalService.publisher.next(null);
          resolve(true);
          // this.router.navigate(['/master/manage-product']);
          //this.reloadComponent();
        },
        cancelText: 'No',
        cancelCallback: () => {
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
    if (!this.form.valid || (!this.isNotFile && !this.isEdit)) {
    // if (!this.form.valid) {
      return;
    }

    try {
      this.model.expiryDate = this.model?.expiryDate || null; 
      console.log(this.model)
      const model = ManageProductModelMapper.mapToModel(this.model,this.userService);
      console.log(model)
      let result: ApiResponse<ManageProductMasterModel>;
      if (this.isEdit) {
        
        if(this.model?.uploadedDocs?.length > 0){
          let res;
          // if (this.curentStatus !== this.model.activeFlag) {
          //   res = await this.onStatusChange(this.model.activeFlag);
            
          //   if (!res) {
          //     return;
          //   }
          // }
          this.loading = true;
          await this.onCreateUpdate("update",model,result);
          // result = await this.docService.update(model);
        }
        else{
          this.alertService.show("File is required.", AlertType.Critical);
        }
      } else {
        model.activeFlag = 1;
        // await this.onCreateUpdate("create",model,result);
        
        result = await this.productService.create(model);
        this.model.documentId = result?.data?.documentId;
        
        if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.showUpload = true;
            if(result?.message?.messageDescription.length){
              this.alertService.show(result?.message?.messageDescription );
            }
            else
              this.alertService.show("Status Updated Successfully");
            // this.onClose()
          }
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
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Product Name ', AlertType.Critical);

      }else{
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add Product Name ', AlertType.Critical);

      }
    }
    this.loading = false;
    
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
    formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
  
      return [day, month, year].join('-');
    }

}
