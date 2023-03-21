import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { FlatpickrOptions } from 'ng2-flatpickr';

@Component({
  selector: 'jd-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DateTimeComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DateTimeComponent
    }
  ]
})
export class DateTimeComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() label = 'Select Date';
  @Input() markAsRequired = false;
  @Input() disableLable= false
  // @Input() ngModel:any | Date;
  @Input() selectedDate: any; // = new Date('12-17-1997'); mm-dd-yyyy
  // get selectedDate() {
  //   return this.SelectedDate;
  // }
  // set selectedDate(val: any) {
  //   this.SelectedDate = val;
  //   this.onChange(val);
  // }
  @Input() allowInput: boolean;
  @Input() minDate: string | Date;
  @Input() maxDate: string | Date;
  @Input() range = false;
  @Input() multiple = false;
  @Input() control: FormControl;
  @Input() disabled: boolean;
  @Input() disablePreviousDate = false;
  @Input() placeholder: string = 'dd-mm-yyyy';
  @Input() format: string = 'd-m-Y';
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  options: FlatpickrOptions;
  touched = false;

  onChange = (val: any) => {};
  onTouched = () => {};

  constructor() {
  }

  ngOnInit(): void {
    this.options = {
      altInput: true,
      altInputClass: 'form-control uxf-date-picker-input',
      allowInput: this.allowInput,
      dateFormat: this.format,
      altFormat: this.format,
      minDate: this.minDate,
      maxDate: this.maxDate,
      mode: this.range ? 'range' :  this.multiple ? 'multiple' : 'single',
      clickOpens: !this.disabled,
      disableMobile: true,
      // disable: [{
      //   from: new Date("2021-05-14T18:12:47.067Z"),
      //   to: new Date()
      // }] as any,
      onChange: (selectedDate: Date[]) => {
        if (selectedDate == this.selectedDate) { return; }
        if (selectedDate && selectedDate.length === 0 && this.selectedDate && this.selectedDate.length === 0) { return; }
        if (this.range) {
          if (!selectedDate || selectedDate.length === 0) {
            if(selectedDate == this.selectedDate) { return; }
          } else if (selectedDate.length === 1){
            return;
          } else if(this.selectedDate && this.selectedDate.length === 2 && selectedDate.length === 2){
            if(selectedDate[0].toISOString() === this.selectedDate[0].toISOString() &&  selectedDate[1].toISOString() === this.selectedDate[1].toISOString()){return;}
          }
        }
        else if( this.multiple)
        {
          if (selectedDate && selectedDate[0] && this.selectedDate && this.selectedDate[0] && selectedDate[0].toISOString() === this.selectedDate[0].toISOString()) {
            if(selectedDate.length == this.selectedDate.length)
            return; }
        }
         else {
          if (selectedDate && selectedDate[0] && this.selectedDate && this.selectedDate[0] && selectedDate[0].toISOString() === this.selectedDate[0].toISOString()) {return; }
        }
        this.selectedDate = selectedDate;
        this.onChange(selectedDate);
        this.valueChange.emit(selectedDate);
      },
    };
    if (this.disablePreviousDate) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      this.options['minDate'] = start;
    }
    if (!this.selectedDate && this.allowInput) {
      this.selectedDate = null;
    } else {
      this.selectedDate = this.selectedDate;
    }
  }

  onValueChange(e: any) {
    if (e.target.value === undefined) { return; }
    this.selectedDate = e.target.value;
    // this.onChange(e.target.value);
    this.valueChange.emit(e.target.value);
  }

  writeValue(val: any[]) {
    if (val == this.selectedDate) { return; }
    this.selectedDate = val;
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
    const val = control.value;
    return null;
  }

}
