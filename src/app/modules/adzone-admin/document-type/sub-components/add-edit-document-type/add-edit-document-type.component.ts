import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OktaService } from 'src/app/core/services/oktaauth.service';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { IndependentcomponentserviceService } from 'src/app/shared/services/independentcomponentservice.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DocumentTypeMasterModel } from '../../../models/doc-type-master.model';
import { DocumentTypeService } from '../../../services/doc-type.service';
import { DocTypeModelMapper, DocumentTypeView } from '../../models/doc-type-view.model';

@Component({
  selector: 'jd-add-edit-document-type',
  templateUrl: './add-edit-document-type.component.html',
  styleUrls: ['./add-edit-document-type.component.scss']
})
export class AddEditDocumentTypeComponent implements OnInit {

  title = '';
  buttonText='';
  loading = false;
  isEdit = false;
  showUpload = false;
  showPreview = false;
  @Output() closed = new EventEmitter();
  curentStatus: string;
  fileUplodExtention = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png','mp4'];
  fileUplodExtentionThumbnail = [ 'jpg', 'jpeg', 'png'];
  docFn: any;
  docthumb:any;
  pastDate: boolean = false;
  @ViewChild('documentType', { static: false }) form: NgForm;
  @Input() doc_Id : any;
  @Input() model: DocumentTypeView;
  isNotFile = true;
  isNotFile1 = true;
  uploadedDocs: {fileName: string, fileUrl: string, fileId?:number}[];
  thumbnailDocs: {fileName: string, fileUrl: string, fileId?:string}[];
  regionOptions: MasterDataModel[];
  selectedRegion: Array<{ id: number, name: string }>;
  subRegionOptions: MasterDataModel[] = [];
  selectedSubRegion : Array<{ id: number, name: string }>;
  countryOptions: MasterDataModel[] = [];
  selectedCountry : Array<{ id: number, name: string }>;
  docOptions: MasterDataModel[] = [];
  selectedDoc : Array<{ id: number, name: string }>;
  category1Options: MasterDataModel[] = [];
  selectedCat1 : Array<{ id: number, name: string }>;
  category2Options: Array<{ id: number, name: string }> = [];
  category3Options: Array<{ id: number, name: string }> = [];
  selectedCat2 : Array<{ id: number, name: string }>;
  divisionOptions: MasterDataModel[] = [];
  thumbnailFile: {fileName?: string, fileUrl?: string, fileId?:string}[];
  uploadedFile: {fileName?: string, fileUrl?: string, fileId?:number}[];
  currentDate: Date = new Date();
  oldExpiryDate: string;
  @ViewChild('dataTable') dataTable: DataTableComponent;
  @Output() previewDataTable = new EventEmitter<any>();
  selectedDataFiles:any[]=[]
  approvalOptions: any;
  // approvalStatus: any[];
  approvalEdit:boolean;
  roleName: string;
  disabled: boolean = true;
  // save: boolean = true;
  // superadmin: boolean;
  publish_status: any;
  constructor(
    private alertService: AlertsService,
    private modalService: ModalDialogService,
    private docService: DocumentTypeService,
    private masterDataService: MasterDataService,
    private userService: UserService,
    private intcompservice: IndependentcomponentserviceService,
    private okta:OktaService

    ) { 
      this.docFn = this.docService.uploadFiles.bind(this.docService);
    console.log('Doc Add')

      this.docthumb = this.docService.uploadthumbFiles.bind(this.docService);
    }

  async ngOnInit() {
console.log('this.model',this.model)
    this.currentDate.setHours(0,0,0,0);
    this.isEdit = this.model ? true : false;
    this.roleName = this.userService.userInfo?.role;
  
    // if(this.isEdit){
    //   if(this.model.publishStatus == null){
    //     if(this.roleName == 'Super Admin'){
    //       this.superadmin = false;
    //       this.save = true;
    //       this.disabled = false;
    //     }
    //     else if(this.roleName != 'Super Admin'){
    //       this.superadmin = true;
    //       this.disabled = true;
    //       this.save = false;
    //     }
    //   }
      
    //   if(this.model.publishStatus == 'Rejected'){
    //     console.log(this.model.editable,'this.model.editable')
    //     if(this.roleName == 'Sub Region Admin'){
    //       if(this.model.editable == true){
    //         this.save = true;
    //         this.superadmin = true;
    //       this.disabled = true;
    //       }
    //       else{
    //         this.superadmin = true;
    //         this.disabled = true;
    //         this.save = false;

    //       }
          
          
    //     }
    //     else if(this.roleName == 'Super Admin'){
    //       this.superadmin = true;
    //       this.disabled = true;
    //       this.save = false;
    //     }
    //     this.model.approval = [{id: 2, name: "Rejected"}]

    //   }
    //   else if(this.model.publishStatus == 'Waiting for Review'){
    //     if(this.roleName == 'Sub Region Admin'){
    //       this.superadmin = true;
    //       this.disabled = true;
    //       this.save = false;
    //     }
    //     else if(this.roleName == 'Super Admin'){
    //       this.superadmin = true;
    //       this.disabled = false;
    //       this.save = true;
    //     }

    //   }
    //   else if(this.model.publishStatus == 'Not Applicable'){
    //     if(this.roleName == 'Super Admin'){
    //       this.superadmin = false;
    //       this.disabled = true;
    //       this.save = true;
    //     }
    //     else if(this.roleName == 'Sub Region Admin'){
    //       this.superadmin = false;
    //       this.disabled = true;
    //       this.save = false;
    //     }

    //   }
    //   if(this.model.publishStatus == 'Approved'){
    //       this.superadmin = true;
    //       this.disabled = true;
    //       this.save = false;
    //     this.model.approval = [{id: 3, name: "Approved"}]
    //   }
   
    // }
    

    this.title = this.model ? 'Update Document Name' : 'Add Document Name';
    this.buttonText = this.model ? 'Update' : 'Next';
    this.model = this.model || {} as any;
    this.model.documentName = this.model?.documentName || ''; 
    this.model.expiryDate = this.model.expiryDate || null;
    console.log(this.model,'document')
    //this.model.expiryDate = this.model?.expiryDate || ''; 
    this.initializeData().then(x => { });
    // this.loadApprovalStatus();
    
  }
  async initializeData() {
   
    if(this.isEdit){
      this.approvalEdit = true;
      if(this.model.expiryDate && this.model.expiryDate.length){
        if(this.model.expiryDate[0] < [this.currentDate][0]){
          this.pastDate = true;
          this.oldExpiryDate = this.formatDate(this?.model?.expiryDate[0])
        }
      }
      this.intcompservice.currentMessageUpload.subscribe(async message => {
        this.model.deleteFileIdList =  message.map((x: any) => ({id: x.fileId,name:x.fileName}));
        console.log('selected model',this.model);

      })
      this.uploadedFile = this.model.uploadedDocs || null;
     
      this.uploadedFile? this.isNotFile = false : this.isNotFile = true;
      this.thumbnailFile = this.model.thumbnailDocs || null;
      this.thumbnailFile? this.isNotFile1 = false : this.isNotFile1 = true;
      if(this.model?.documentSubChildCategoryId[0].id == null){
        this.model.documentSubChildCategoryId = null;
      }
      if(this.model?.documentSubChildFourthCategoryId[0].id == null){
        this.model.documentSubChildFourthCategoryId = null;
      }
    }
    console.log('data',this.model)
    this.curentStatus = this.model.activeFlag;
    this.model.regionId = this.model.regionId?.length && this.model.regionId || null;
    this.model.subRegions = this.model.subRegions?.length && this.model.subRegions || null;
    this.model.countries = this.model.countries?.length && this.model.countries || null;
    this.model.documentCategoryId = this.model.documentCategoryId?.length && this.model.documentCategoryId || null;
    this.model.documentSubChildCategoryId = this.model.documentSubChildCategoryId?.length && this.model.documentSubChildCategoryId || null;
    this.model.documentSubChildFourthCategoryId = this.model.documentSubChildFourthCategoryId?.length && this.model.documentSubChildFourthCategoryId || null;
    try{
      this.docOptions = await this.docService.getDocCategory(true);
      this.docOptions = this?.docOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      this.regionOptions = await this.docService.getRegion(true)
        if (this.regionOptions?.length == 1 && (this.model.regionId?.length == 0 || this.model.regionId == null)) {
          this.model.regions = this.regionOptions;
        }
      // console.log(this.model)
      
    }catch (error) {
      console.error(error);
    }
  }

  changeExpiry(){
    if(this.pastDate && this.model.expiryDate.length){
      this.pastDate = false;
    }
  }
  // async loadApprovalStatus(event?:any){
  //   this.approvalOptions = await this.docService.getApproval();
  //   // if (event?.length) {
  //     this.approvalStatus = await this.docService.getApproval();
  //     console.log('approval',this.approvalStatus)
  //     this.approvalStatus = this?.approvalStatus?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
  //     if (this.model.approval && this.model.approval?.length > 0) {
  //       if (this.approvalStatus)
  //         this.model.approval = this.model.approval.filter(o1 => this.approvalStatus.some(o2 => o1.id === o2.id));
  //       if (!this.approvalStatus) {
  //         if (this.approvalStatus && this.approvalStatus?.length == 1) {
  //           this.model.approval = this.approvalStatus;
  //         }
  //         else {
  //           this.model.approval = null;

  //         }
  //       }
  //     }
  //     else{
  //       if (this.approvalStatus && this.approvalStatus?.length == 1 ) {
  //         this.model.approval = this.approvalStatus;
  //       }
  //       else {
  //         this.model.approval = null;
  //       }
  //     }
  //   // }
    
  // }
  async loadSubByRegions(event:any) {
    var regionIds: {regionId: number}[] = []
    event?.forEach(x => {
      regionIds.push({regionId:x?.id});
    });
    regionIds['subModuleSlug'] = 'create_doc';
    if (event?.length) {
      this.subRegionOptions = await this.docService.getSubRegion(regionIds, true);
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
    subregionIds['subModuleSlug'] = 'create_doc';
    if (event?.length) {
      this.divisionOptions = await this.docService.getDivision(subregionIds, true);
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
    ids['subModuleSlug'] = 'create_doc';
    if (event?.length) {
      this.countryOptions = await this.docService.getCountry(ids, true);
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
      else{
        if (this.countryOptions && this.countryOptions?.length == 1 ) {
          this.model.countries = this.countryOptions;
        }
        else {
          this.model.countries = null;
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
      this.category1Options = await this.docService.getDocCat1(event[0].id, true);
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
          this.model.documentSubCategoryId = null;
          this.model.documentSubChildCategoryId = null;
          this.model.documentSubChildFourthCategoryId = null;
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
      this.category3Options = null;
      if (this.model.documentSubCategoryId != null)
        this.model.documentSubCategoryId = null;
      this.loadCat2ByCat1(this.model.documentSubCategoryId);
    }
    // this.model.documentSubChildCategoryId = null;
    
  }

  async loadCat1ByDoc3(event:any){
    if(this.model.documentSubCategoryId != null){
      console.log('pop')
      this.category1Options = [];
      this.category2Options = [];
      this.category3Options = [];
      this.model.documentSubChildCategoryId = [];
      this.model.documentSubCategoryId = [];
      this.model.documentSubChildFourthCategoryId = [];
    }
  }
  async loadCat2ByDoc3(event:any){
    if(this.model.documentSubChildCategoryId != null){
      console.log('pop')
      this.category2Options = [];
      this.category3Options = [];
      // this.model.documentSubChildCategoryId = [];
      this.model.documentSubChildFourthCategoryId = [];
    }
  }
  async loadCat3ByDoc3(event:any){
    if(this.model.documentSubChildCategoryId != null){
      console.log('pop')
      this.category3Options = [];
      // this.model.documentSubChildCategoryId = [];
      this.model.documentSubChildFourthCategoryId = [];
    }
  }
  async loadCat2ByCat1(event:any){
    console.log('load 2')
    if (event?.length) {
      let docId:number;
      this.category2Options = await this.docService.getDocCat2(event[0].id, true);
      this.category2Options = this?.category2Options?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      if (event && event?.length > 0) {
    console.log('load 21')

        if(this.category2Options){
    console.log('load 12')

          this.model.documentSubChildCategoryId = this.model.documentSubChildCategoryId?.filter(o1 => this.category2Options.some(o2 => o1.id === o2.id));
        }
        if (!this.category2Options) {
    console.log('load 121')

          if (this.category2Options && this.category2Options?.length == 1) {
            this.model.documentSubChildCategoryId = this.category2Options;
          }
          else {
            this.model.documentSubCategoryId = null;
            this.model.documentSubChildCategoryId = null;
            this.model.documentSubChildFourthCategoryId = null;
          }
        }
      }
      else {
        if (this.category2Options && this.category2Options?.length == 1 ) {
          this.model.documentSubChildCategoryId = this.category2Options;
        }
        else {
          this.model.documentSubCategoryId = null;
          this.model.documentSubChildCategoryId = null;
          this.model.documentSubChildFourthCategoryId = null;
        }
      }
    } else {
      this.category1Options = null;
      this.category2Options = null;
      this.category3Options = null;
      if (this.model.documentSubChildCategoryId != null)
        this.model.documentSubChildCategoryId = null;
        this.model.documentSubChildFourthCategoryId = null;

    }
  }
  async loadCat3ByCat2(event:any){
    // console.log('event',event)
    if (event?.length) {
      
      let docId:number;
      this.category3Options = await this.docService.getDocCat3(event[0].id, true);
      this.category3Options = this.category3Options?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
      if (event && event?.length > 0) {
        if(this.category3Options){
           console.log('this',this.model)
          this.model.documentSubChildFourthCategoryId = this.model.documentSubChildFourthCategoryId?.filter(o1 => this.category3Options.some(o2 => o1.id === o2.id));
          console.log('this',this.model)
        }
        if (!this.category3Options) {
         
          if (this.category3Options && this.category3Options?.length == 1) {
            this.model.documentSubChildFourthCategoryId = this.category3Options;
          
          
          }
          else {
            this.model.documentSubChildFourthCategoryId = null;
          }
          // this.model.documentSubChildCategoryId = null;
        }
      }
      else {
        if (this.category3Options && this.category3Options?.length == 1 ) {
          this.model.documentSubChildFourthCategoryId = this.category3Options;
        }
        else {
          this.model.documentSubChildFourthCategoryId = null;
        }
      }
    } else {
      // this.category1Options = null;
      // this.category2Options = null;
      if (this.model.documentSubChildCategoryId != null)
        this.model.documentSubChildCategoryId = null;
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
  onthumbUpload(file: {fileName: string, fileUrl: string}[]) {
    file = file || [];
    this.model.thumbnailDocs = file;
    if (this.model.thumbnailDocs.length > 0) {
      this.isNotFile1 = false;
    }
  }
  
  onClose() {
    this.closed.emit();
  }
  onSubmit(){
    console.log(this.model)
    if(this.model?.uploadedDocs?.length > 0){
      if(!this.isEdit)
      this.alertService.show("Document Added Successfully");
      this.onClose();
    }else{
      this.alertService.show("File is required.", AlertType.Critical);
    }
    
  }
  // onPreview(){
  //   this.doc_Id = this.model.documentId;
  //   if(this.model?.uploadedDocs?.length > 0){
  //     if(!this.isEdit){
  //     this.showPreview = true;
  //     this.showUpload = false;
  //   }else if(this.isEdit){
  //     this.showPreview = true;
  //     this.showUpload = false;
  //   }
  //   }else{
  //     this.alertService.show("File is required.", AlertType.Critical);
  //   }
  // }
  onCloseUploadModal(e:any){
    this.showUpload = false;
    this.dataTable.redrawGrid();
  }
  previewTable(){
   console.log("sdsd");
    this.previewDataTable.emit();
  }
  onStatusChange(status: string) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'Active' ? 'Activate User' : 'Deactivate Document Name',
        message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this document name?`,
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
        title: status === 'create' ? 'Create Document' : 'Update Document',
        message: `Are you sure you want to ${status === 'create' ? 'Create' : 'Update'} this document?`,
        okText: 'Yes',
        okCallback: async () => {
          if(status === 'create'){
            result = await this.docService.create(model);
            this.model.documentId = result?.data?.documentId;
            this.showUpload = true;
          }
          else{
            result = await this.docService.update(model);
            // this.onClose();
            this.modalService.publisher.next(null);
          resolve(true);

          }
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
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
      const model = DocTypeModelMapper.mapToModel(this.model,this.userService);
      // if(this.model.publishStatus == 'Not Applicable'){
      //   if(this.roleName == 'Super Admin'){
      //     model.approval = [];
      //   }

      // }
     
      let result: ApiResponse<DocumentTypeMasterModel>;
      if (this.isEdit) {
        if(this.model?.uploadedDocs?.length > 0){
          let res;
          if(this.curentStatus != undefined){
            if (this.curentStatus !== this.model.activeFlag) {
              console.log("if cond",this.curentStatus,this.model.activeFlag);
                res = await this.onStatusChange(this.model.activeFlag);
                if (!res) {
                  return;
                }
              }
          }
          this.loading = true;
          // model.publishStatus = model.approval[0]?.name;
          console.log('update',model)
          await this.onCreateUpdate("update",model,result);
          // result = await this.docService.update(model);
        } else{
          this.alertService.show("File is required.", AlertType.Critical);
        }
        // else if(this.model?.uploadedDocs?.length == 0){
        //   if(this.roleName == 'Super Admin'){
        //     if(this.publish_status == 'Approved'){
        //       this.alertService.show("File is required.", AlertType.Critical);
        //     }
        //     else if(this.publish_status == 'Rejected'){
        //       let res;
        //       if(this.curentStatus != undefined){
        //         if (this.curentStatus !== this.model.activeFlag) {
        //           console.log("if cond",this.curentStatus,this.model.activeFlag);
        //             res = await this.onStatusChange(this.model.activeFlag);
        //             if (!res) {
        //               return;
        //             }
        //           }
        //       }
        //       this.loading = true;
        //       model.publishStatus = model.approval[0]?.name;
        //       console.log('update',model)
        //       await this.onCreateUpdate("update",model,result);
        //     }
        //   }
          
          
        // }
      } else {
        model.activeFlag = 1;
        // await this.onCreateUpdate("create",model,result);
        
        result = await this.docService.create(model);
        this.model.documentId = result?.data?.documentId;
        
        if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.showUpload = true;
            if(result?.message?.messageDescription.length){
              this.alertService.show("Document Id is Created Successfully. Kindly Upload the Documents.",AlertType.Warning );
            }
            else
              this.alertService.show("Status Updated Successfully");
            // this.onClose()
          }
      }
    } catch (error) {
      if(this.isEdit){
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Document Name ', AlertType.Critical);

      }else{
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add Document Name ', AlertType.Critical);

      }
    }
    this.loading = false;
  }
  onClear() {
    this.onClose();
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
  approvalChange(e){
    console.log('events',e)
    this.publish_status = e[0].name;
  }
}
