import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";

const jdNamePattern = '^[a-zA-Z0-9]+$';

@Directive({
    selector: '[jdAlfaNumeric]',
    providers: [{
      provide: NG_VALIDATORS,
      useExisting: JdAlphaNumericValidatorDirective,
      multi: true
    }]
})
export class JdAlphaNumericValidatorDirective implements Validator {

    @Input('jdAlfaNumeric') pattern = '';

    validate(control: AbstractControl): ValidationErrors | null {
        return alphaNumericValidator(this.pattern)(control);
      }
}

export function alphaNumericValidator(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      pattern = pattern || jdNamePattern;
      const isValid = new RegExp(pattern, 'g').test(control.value);
      return isValid ? null : {jdAlfaNumeric: {value: control.value}};
    };
}
