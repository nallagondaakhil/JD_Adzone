import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { CommonSyncService } from '../../services/common-sync.Service';

@Component({
  selector: 'jd-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CurrencyInputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CurrencyInputComponent
    }
  ]
})

export class CurrencyInputComponent implements OnInit, ControlValueAccessor, Validator {

  touched = false;
  @ViewChild('currencyInput') currencyInput: ElementRef;
  value: string = '';
  tagrgetValue:string=''
  @Input() label: string;
  @Input() markAsRequired: boolean;
  @Input() control: FormControl;
  @Input() type = '₹';
  @Input() disabled = false;
  @Input() min: number = null;
  @Input() max: number = null;
  @Input() maxLength: number = null;
  @Input() hideCurrencySymbol: boolean = false;
  @Input() disableLable: boolean = false;
  onChange = (val: string) => {};
  onTouched = () => {};
  periodContains: boolean = false;
  @Input() showPercentSymbol: boolean = false;
  @Input() handleBlur: boolean = true;
  @Input() Placeholder: string = '';
  @Input() writeCurency=false
  userToken: string;
  pathArray: string[];
  requiredData:any;
  constructor(private cp: CurrencyPipe,
    private userService: UserService,
    public common:CommonSyncService,
    private masterservice:MasterDataService) { }

  ngOnInit(): void {
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

  writeValue(val: string) {
    this.value = val;
    if(val?.toString()?.indexOf('.')>0){
      this.periodContains = true;
    }
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched && this.handleBlur) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if ( this.min != null && control.value < this.min)
    {
      return Validators.min(this.min)(control);
    }
    else if ( this.max != null && control.value > this.max){
        return Validators.max(this.max)(control);
    }
    // if (quantity <= 0) {
    //   return {
    //     mustBePositive: {
    //       quantity
    //     }
    //   };
    // }
  }

  changeValue(e: any) {
   this.tagrgetValue = e.target.value;
    //this.control.setValue(this.cp.transform(this.value,'INR','symbol','1.2-2'))
    this.onChange(e.target.value);
  }

  onKeyPress(event: KeyboardEvent) {
    if(event.code == "KeyE")
    {
      event.preventDefault();
      return;
    }

    let x = event.code;
    if(this.maxLength!=null&&this.value?.length==this.maxLength && x!='Period' && !this.periodContains){
      event.preventDefault();
    }else if(x === 'Period'){
      this.periodContains = true;
    }
    if (false) {
        event.preventDefault();
    }
  }

  onKeyDown(event: KeyboardEvent){
    if(event.code === 'Backspace' && this.periodContains){
      if(this.value?.toString()?.indexOf('.')<0){
        this.periodContains = false;
      }
    }
  }
  OnCurrencyClick()
  {
    this.writeCurency =true;
    setTimeout(() => {
      // this.currencyInput.nativeElement.click()
      this.currencyInput?.nativeElement?.focus();

    }, 300);

  }
  focusoutinput()
  {
    this.value=this.tagrgetValue;
    if(!this.hideCurrencySymbol)
    {
      this.writeCurency=false;
    }
    else if(this.showPercentSymbol){
      this.writeCurency=false;

    }
  }
}
