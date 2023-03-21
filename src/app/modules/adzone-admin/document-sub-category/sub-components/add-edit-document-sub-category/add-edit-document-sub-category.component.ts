import { ConditionalExpr } from '@angular/compiler';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { SubCatMaster } from '../../../models/sub-cat-master.model';
import { SubCatService } from '../../../services/sub-cat.service';
import { SubCatView , SubCatMasterModelMapper } from '../../models/sub-cat-view.model';

@Component({
  selector: 'jd-add-edit-document-sub-category',
  templateUrl: './add-edit-document-sub-category.component.html',
  styleUrls: ['./add-edit-document-sub-category.component.scss']
})
export class AddEditDocumentSubCategoryComponent implements OnInit {

  title='';
  buttonText='';
  loading = false;
  showDate=true;
  @Output() closed = new EventEmitter();
  categoryOptions: MasterDataModel[] = [];;
  selectedSacDescription:string='';
  actSacOptions: {
    id: number;
    name: string;
    activitySacDesc?:string;
    isDeleted?: boolean;
}[] = [];
  documentSubCategoryId:any;
  documentSubCategoryName:any;
  curentStatus: string;
  @Input() model: SubCatView;
  @ViewChild('addeditdoccat', { static: false }) form: NgForm;
   saveedit="";
   isEdit: boolean;
   documentSubChildCategory:any;
   documentSubChildCategory1:any;
   permissionEdit: any;
   resticday=new Date()
   today=new Date()
  constructor(private masterDataService: MasterDataService,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private subcatservice :SubCatService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,) { }

  async ngOnInit() {
    this.isEdit = this.model ? true : false;
   
    
     this.title = this.model ? 'Update Document Sub-Category' : 'Add Document Sub-Category';
     this.buttonText = this.model ? 'Update' : 'Submit';
     this.model = this.model || {} as any;
     this.model.documentSubChildCategory = this.model?.documentSubChildCategory?.length &&  this.model?.documentSubChildCategory || [];
    //this.model.category1 = this.model?.category1 || ''; 
    console.log('modaldata',this.model)
     //this.documentCategoryId = this.model?.documentCategoryId;
     this.documentSubCategoryName = this.model?.documentSubCategoryName;
     this.documentSubCategoryId = this.model?.documentSubCategoryId;
     this.categoryOptions = await this.subcatservice.getCategoryDetails();
     this.categoryOptions = this?.categoryOptions?.sort((a, b) => (a?.name > b?.name) ? 1 : -1)
   
    this.initializeData().then(x => { });
  
  }

  async initializeData() {

    this.model = this.model || {} as any;
    this.model.documentCategoryId = this.model.documentCategoryId?.length && this.model.documentCategoryId || null;
    
    // if(!this.isEdit){
    //   // this.model.isActive = 0;
    // }
    // else{
    //   // this.curentStatus = this.model.isActive;
    // }
  }
  onClose(){
    this.closed.emit();
  }

  addexpense(i?:any){
    // if(i){
      console.log('modal',this.model.documentSubChildCategory)
      this.model.documentSubChildCategory.push({
        documentSubChildCategoryId:this.model.documentSubChildCategory?.length,
        documentSubChildCategoryName:this.model.documentSubChildCategory[i]?.documentSubChildCategoryName,
        childFourthCategory:[]
      })
    // }
    console.log('modal categoiry',this.model.documentSubChildCategory)

   
  }
  addexpenseCategory(i:any){
    console.log('ezxpenxe',this.model.documentSubChildCategory)
    this.model.documentSubChildCategory[i].childFourthCategory.push({
      documentSubChildFourthCategoryId:this.model.documentSubChildCategory[i].childFourthCategory?.length,
      documentSubChildFourthCategoryName:null,
      // documentfourthSubChildCategory:[]
    })
   
  }
  async onexpenseMinues( i:any,j:any,docId:any,docchildId:any){
    console.log('doc',i,j,docchildId,docId)
   
    if(this.isEdit){
      let result = await this.subcatservice.deleteSubFourthCatID(docchildId); 
      
    }
    this.model.documentSubChildCategory[j]?.childFourthCategory.splice(i,1);
    console.log('doc',this.model.documentSubChildCategory)
  }
  onStatusChange(status: string) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'Active' ? 'Activate User' : 'Deactivate Document Sub-Category Message',
        message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this document sub-category?`,
        okText: 'Yes',
        okCallback: async () => {
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
  onCreateUpdate(status: string,model:any,result:any) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'create' ? 'Create Document Sub-Category' : 'Update Document Sub-Category',
        message: `Are you sure you want to ${status === 'create' ? 'Create' : 'Update'} this sub-document category?`,
        okText: 'Yes',
        okCallback: async () => {
          if(status === 'create')
          result = await this.subcatservice.create(model);
          else
          result = await this.subcatservice.update(model);
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
          console.log('pop without')

            if(result?.message?.messageDescription)
            
              this.alertService.show(result?.message?.messageDescription);
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
      return;
    }

    try {
      
      
//category: undefined
// this.documentCategoryId= this.model.documentCategoryId,
// this.documentSubCategoryId= this.model.documentSubCategoryId,
// this.documentSubCategoryName= this.model.documentSubCategoryName,

// this.documentSubChildCategory= this.model.documentSubChildCategory;
      const model = SubCatMasterModelMapper.mapToModel(this.model,this.userService);
     
      let result: ApiResponse<SubCatMaster>;
     
      if (this.isEdit) {
        let res;
        this.loading = true;
        await this.onCreateUpdate("update",model,result);
        // result = await this.subcatservice.update(model);
      } else {
        model.activeFlag = 1;
        console.log('result?.message?.messageDescription')
        await this.onCreateUpdate("create",model,result);
        // result = await this.subcatservice.create(model);
      }
      // if (ApiErrorUtil.isError(result)) {
      //   this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      // } else {
      //   if(result?.message?.messageDescription.length)
      //     this.alertService.show(result?.message?.messageDescription );
      //   else
      //     this.alertService.show("Status Updated Successfully");
      //   this.onClose();
      // }
    } catch (error) {
      if(this.isEdit){
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Document  Sub-Category ', AlertType.Critical);
      }else{
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add Document  Sub-Category ', AlertType.Critical);

      }
    }
    this.loading = false;
  }
  async onactChange(event: { id: number, name: string }[]) {
    this.selectedSacDescription = '';
    if (event != null) {
      const selectedAct: { id: number, name: string } = event && event[0];
      if (selectedAct && selectedAct.name) {
        const activity = this.actSacOptions.find(x => x.id === selectedAct.id);
        // const category = activity && await this.masterDataService.getCategory(activity.categoryId);
        this.selectedSacDescription = activity?.activitySacDesc;
       
      }
    }
  }

}
