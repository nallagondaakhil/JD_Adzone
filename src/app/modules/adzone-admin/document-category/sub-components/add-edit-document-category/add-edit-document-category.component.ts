import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DocumentCategoryMasterModel } from '../../../models/doc-cat-master.model';
import { DocumentCategoryService } from '../../../services/doc-cat.service';
import { DocCategoryModelMapper, DocumentCategoryView } from '../../models/doc-cat-view.model';

@Component({
  selector: 'jd-add-edit-document-category',
  templateUrl: './add-edit-document-category.component.html',
  styleUrls: ['./add-edit-document-category.component.scss']
})
export class AddEditDocumentCategoryComponent implements OnInit {

  title='';
  buttonText='';
  loading = false;
  @Output() closed = new EventEmitter();
  roleOptions: { id: string, name: string }[] = [];
  curentStatus: string;
  @Input() model: DocumentCategoryView;
  @ViewChild('addeditdoccat', { static: false }) form: NgForm;
   saveedit="";
   isEdit: boolean;
   resticday=new Date()
   today=new Date()
  constructor(private masterDataService: MasterDataService,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private cdr: ChangeDetectorRef,
    private docService: DocumentCategoryService,
    private userService: UserService,) { }

  async ngOnInit() {
    this.isEdit = this.model ? true : false;
    this.title = this.model ? 'Update Document Category' : 'Add Document Category';
    this.buttonText = this.model ? 'Update' : 'Submit';
    this.model = this.model || {} as any;
    this.model.documentCategoryName = this.model?.documentCategoryName || ''; 
    this.initializeData().then(x => { });
  }
  async initializeData() {
    // if(!this.isEdit){
    //   this.model.isActive = 0;
    // }
    // else{
    //   this.curentStatus = this.model.status;
    // }
    this.curentStatus = this.model.activeFlag;
  }
  onClose(){
    this.closed.emit();
  }
  onStatusChange(status: string) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'Active' ? 'Activate Document Category' : 'Deactivate Document Category',
        message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this document category?`,
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
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'create' ? 'Create Document Category' : 'Update Document Category',
        message: `Are you sure you want to ${status === 'create' ? 'Create' : 'Update'} this document category?`,
        okText: 'Yes',
        okCallback: async () => {
          if(status === 'create')
          result = await this.docService.create(model);
          else
          result = await this.docService.update(model);
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
      if (this.isEdit) {
      }
      const model = DocCategoryModelMapper.mapToModel(this.model,this.userService);
      let result: ApiResponse<DocumentCategoryMasterModel>;
      if (this.isEdit) {
        let res;
        if (this.curentStatus !== this.model.activeFlag) {
          res = await this.onStatusChange(this.model.activeFlag);
          
          if (!res) {
            return;
          }
        }
        this.loading = true;
        // model.isEdit = 1;
        await this.onCreateUpdate("update",model,result);
        // result = await this.docService.update(model);
      } else {

        model.activeFlag = 1;
        // model.isEdit = 0;
        await this.onCreateUpdate("create",model,result);
        // result = await this.docService.create(model);
      }
      
    } catch (error) {
      if(this.isEdit){
      this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Document Category ', AlertType.Critical);
    }else{
      this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add Document Category ', AlertType.Critical);

    }
    }
    this.loading = false;
  }

}
