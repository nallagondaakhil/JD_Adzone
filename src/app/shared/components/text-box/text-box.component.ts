import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { CommonSyncService } from '../../services/common-sync.Service';

@Component({
  selector: 'jd-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextBoxComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: TextBoxComponent
    }
  ]
})
export class TextBoxComponent implements OnInit, ControlValueAccessor, Validator {

  touched = false;
  @Input()allowOnlyUpperCase=false;
  @Input() value:string = '';
  @Input() label: string;
  @Input() markAsRequired: boolean;
  @Input() control: FormControl;
  @Input() type = 'text';
  @Input() disabled = false;
  @Input() disableLable: boolean = false;
  @Input() isPhoneNum = false;
  @Input() min: number = null;
  @Input() max: number = null;
  @Input() showCalendarIcon: boolean = false;
  @Input() Placeholder: string = '';
  @Input() toolTip: string = '';
  emailValidation: FormControl;
  userToken: string;
  pathArray: string[];
  requiredData:any;
  onChange = (val: string) => {};
  onTouched = () => {};

  constructor(    private userService: UserService,
    public common:CommonSyncService,
    private masterservice:MasterDataService) { }

  ngOnInit(): void {
    this.isPhoneNum ? this.type = 'number' : null;
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
  }else{
    this.requiredData = 'is required';
  }
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

  validate(control: AbstractControl): ValidationErrors | null {
    const val: string = control.value;
    if (this.type == "number")
    {
      if (this.min != null && control.value < this.min)
      {
        return Validators.min(this.min)(control);
      }
      else if (control.value > this.max){
        return Validators.max(this.max)(control)   ;
      }
    }else if(this.type === 'email'){
      if (val) {
        //const matches = val.match(/^([a-zA-Z._+-]+)\w+@[a-zA-Z_.+-]+?\.[a-zA-Z]{2,3}$/);
        const matches = val.match(/^([a-zA-Z0-9._+-]+)\w+@[a-zA-Z0-9_.+-]+?\.[a-zA-Z]{2,3}$/);
        if(matches==null){
          return { invalid: true };
        }else{
          // if(val.endsWith('.in')||val.endsWith('.com')||val.endsWith('.cn')){
          //   return null;
          // }else{
            return null;
          //}
        }
      } else {
        return null;
      }
    }
    return null;
  }

  changeValue(e: any) {
      this.value = e.target.value;
    if(this.allowOnlyUpperCase)
      this.control.setValue(this.value.toUpperCase())
      this.onChange(this.value);
  }

  keyPress(e: any) {
    const pattern = /[0-9\+]/;
    const inputChar = String.fromCharCode(e.charCode);
    if (e.key != 8 && !pattern.test(inputChar)) {
      e.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    if (this.isPhoneNum) {
    let pastedText = event.clipboardData?.getData('text');
    const regExp = /[a-zA-Z]/g;
    if (regExp.test(pastedText)) {
      event.preventDefault();
    }
  }
}


}
