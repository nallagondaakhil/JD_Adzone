import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { StarRatingComponent } from 'ng-starrating';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { ApiResponse } from '../../admin/models/paged-data.model';
import { FeedbackService } from '../services/feedback.service';
import { FeedBackMasterModel } from '../models/feed-back-master.model';
import { FeedBackModelMapper, FeedBackView } from './models/feed-back-view.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jd-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss']
})
export class FeedBackComponent implements OnInit {
  @Input() model: FeedBackView;
  @ViewChild('feedback', { static: false }) form: NgForm;
  loading = false;
  constructor(
    private alertService: AlertsService, 
    private service: FeedbackService,
    public translate:TranslateService) {
    let appliedLang = localStorage.getItem('Applylanguage')
    let preLang = localStorage.getItem('preLanguage')
    if(appliedLang){
      console.log('applied',appliedLang)
      this.translate.use(appliedLang);
    }
    else if(preLang){
      console.log('preLang',appliedLang)
      this.translate.use(preLang);
    }

  }
  ngOnInit(): void {
    console.log('api triggered')

    this.onUpdate();
    console.log('api triggered')
    let appliedLang = localStorage.getItem('Applylanguage')
    let preLang = localStorage.getItem('preLanguage')
    if(appliedLang){
      console.log('applied',appliedLang)
      this.translate.use(appliedLang);
    }
    else if(preLang){
      console.log('preLang',appliedLang)

      this.translate.use(preLang);
    }
    this.model = this.model || {} as any;
    this.model.emailId = this.model?.emailId || '';
    this.model.name = this.model?.name || '';
    this.model.feedBack = this.model?.feedBack || '';
    this.model.rating = this.model?.rating || '';

  }
  onRate($event: { oldValue: string, newValue: string, starRating: StarRatingComponent }) {
    this.model.rating = $event.newValue;
    // alert(`Old Value:${$event.oldValue}, 
    //   New Value: ${$event.newValue}, 
    //   Checked Color: ${$event.starRating.checkedcolor}, 
    //   Unchecked Color: ${$event.starRating.uncheckedcolor}`);
  }
 async onUpdate(){
  console.log('api triggered')
   let result = await this.service.update();
   console.log('api triggered',result)
   this.model.name = result.data.name;
   this.model.emailId = result.data.emailId;
  }
  async onsave() {
    this.form.form.markAllAsTouched();
    if (!this.form.valid) {
      // if (!this.form.valid) {
      return;
    }

    try {
      const model = FeedBackModelMapper.mapToModel(this.model, this.service);
      console.log(model)
      let result: ApiResponse<FeedBackMasterModel>;
      result = await this.service.create(model);
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        if (result?.message?.messageDescription.length) {
          // this.alertService.show(result?.message?.messageDescription);
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.FEEDBACKSAVE);
           });
        }
        else
          // this.alertService.show("Status Updated Successfully");
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.STATUSUPDATEDSUCCESSFULLY);
           });
        // this.onClose()
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    }
    catch (error) {
      
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.FEEDBACKFAIL,AlertType.Critical);
       });
      this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to Add Feedback', AlertType.Critical);

    }
    this.loading = false;
  }
  check(event){
    console.log('event',event.target.checked)
    this.model.nameEmailSavedFlag = event.target.checked
  }
}
