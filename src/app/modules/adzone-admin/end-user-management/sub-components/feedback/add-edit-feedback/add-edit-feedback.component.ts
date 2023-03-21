import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { EndUserMasterModel } from 'src/app/modules/adzone-admin/models/end-user-master.model';
import { EndUserService } from 'src/app/modules/adzone-admin/services/end-user.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { EndUserModelMapper, EndUserView } from '../../../models/end-user-view.model';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jd-add-edit-feedback',
  templateUrl: './add-edit-feedback.component.html',
  styleUrls: ['./add-edit-feedback.component.scss']
})
export class AddEditFeedbackComponent implements OnInit {

  title='';
  buttonText='';
  loading = false;
  feedbackValue=false;
  @Output() closed = new EventEmitter();
  @Input() model: EndUserView;
  @ViewChild('addeditfeedbackform', { static: false }) form: NgForm;
   saveedit="";
   isEdit: boolean;
  constructor(private masterDataService: MasterDataService,
    private modalService: ModalDialogService,
    private service: EndUserService,
    private alertService: AlertsService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    public translate:TranslateService) { }

  async ngOnInit() {
    this.isEdit = this.model?.feedBack ? true : false;
    // this.title = this.model?.feedBack ? 'Edit Feedback' : 'Add Feedback';
    // this.buttonText = this.model?.feedBack ? 'Update' : 'Submit';
    this.model = this.model || {} as any;
    this.model.feedBack = this.model?.feedBack || ''; 
    this.initializeData().then(x => { });
  }
  async initializeData() {
    console.log(this.model)
    if(!this.isEdit){
    }
    else{
    }
  }
  onClose(){
    this.closed.emit();
    
  }
  async onsave(){
    this.form.form.markAllAsTouched();
    if (!this.form.valid) {
      this.feedbackValue=true;
      return;
    }
    try {
      if (this.isEdit) {
      }
      const model = EndUserModelMapper.mapToModel(this.model,this.userService);
      let result: ApiResponse<EndUserMasterModel>;
      // if (this.isEdit) {
      //   this.loading = true;
      //   result = await this.service.updateFeedback(model);
      // } else {
        result = await this.service.createFeedback(model);
      // }
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        if(result?.message?.messageDescription.length)
        {
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.RESPONSEFEEDBACK);
           });
        }
        else
          this.alertService.show("Status Updated Successfully");
          this.onClose();
      }
    } catch (error) {
      this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Feedback', AlertType.Critical);
    }
    this.loading = false;
  }
  

}
