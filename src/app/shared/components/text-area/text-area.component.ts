import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { kMaxLength } from 'buffer';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { CommonSyncService } from '../../services/common-sync.Service';

@Component({
  selector: 'jd-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextAreaComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: TextAreaComponent
    }
  ]
})
export class TextAreaComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() label: string;
  @Input() markAsRequired: boolean;
  @Input() control: FormControl;
  @Input() disabled: boolean;
  @Input() rowCount = 4;
  @Input() disableLable= false
  value = '';
  touched = false;
  @Input() maxlength: any;
  @Input()  displayDynamicLength: boolean = false;
  requiredData:any;
  userToken: string;
  pathArray: string[];
  constructor(
    public common:CommonSyncService,
    private masterservice:MasterDataService,private userService: UserService,
  ) { }

  onChange = (val: string) => {};
  onTouched = () => {};

  ngOnInit() {
    this.userToken = this.userService.getRacfId();
    let language:any = this.masterservice.getLanguage(this.userToken);
    let languageData:any[]=[] ;
    languageData = language.__zone_symbol__value;
    let data = languageData.find((val:any)=> val.checked == true)
    this.pathArray = window.location.pathname.split('/');
    let applyReult = localStorage.getItem('Applylanguage')
    let preReult = localStorage.getItem('preLanguage')
    if(this.pathArray[2] == "feed-back"){
    this.common.currentMessage.subscribe(async message => {
      // setTimeout(()=>{
        console.log('message')
        if(message){
          if( message == 'Chinese'){
          this.requiredData = '是必须的';
          }
          else if(message == 'English' ){
            console.log('englush')
          this.requiredData = 'is required';

          }
        }
      
  })
  if(applyReult){
    console.log('applyReult')

    if( applyReult == 'zh-cn'){
      this.requiredData = '是必须的';
    }
    else if(applyReult == 'en-gb' ){
      this.requiredData = 'is required';
    }
  }
  else if(preReult){
    console.log('preReult')
    if( preReult == 'zh-cn'){
      this.requiredData = '是必须的';
    }
    else if(preReult == 'en-gb' ){
      this.requiredData = 'is required';
    }
  }
}
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    return null;
  }

  writeValue(val: string) {
    this.value = val;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  changeValue(e: any) {
    this.value = e.target.value;
    this.onChange(this.value);
  }

}
