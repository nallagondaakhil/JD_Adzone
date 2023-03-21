import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";

const jdNamePattern = '^[A-Za-z\\s]+$';

@Directive({
    selector: '[jdName]',
    providers: [{
      provide: NG_VALIDATORS,
      useExisting: JdNameValidatorDirective,
      multi: true
    }]
})
export class JdNameValidatorDirective implements Validator {

    @Input('jdName') pattern = '';

    validate(control: AbstractControl): ValidationErrors | null {
        return jdNameValidator(this.pattern)(control);
      }
}

export function jdNameValidator(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      pattern = pattern || jdNamePattern;
      const isValid = new RegExp(pattern, 'g').test(control.value);
      return isValid ? null : {jdName: {value: control.value}};
    };
}
