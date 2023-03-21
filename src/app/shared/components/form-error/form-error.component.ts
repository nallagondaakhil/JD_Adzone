import {
  Component,
  Input,
  ViewEncapsulation,
  HostBinding,
  Self,
  Optional,
  OnInit,
} from '@angular/core';
import {
  NgControl,
  ControlValueAccessor,
  FormGroupDirective,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'jd-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent implements ControlValueAccessor, OnInit {
  
  @Input() errors = [];
  @Input() control: AbstractControl;
  @Input() type = 1;

  constructor(
    @Optional() @Self() public ctrlDir: NgControl,
    @Optional() public ctrlContainer: FormGroupDirective
  ) {
    if (this.ctrlDir) {
      this.ctrlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.control = this.control || (this.ctrlDir && this.ctrlDir.control);
  }

  onChange(event) {}
  onTouched() {}
  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean): void {}
}
