import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyInputComponent } from './currency-input.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CurrencyInputComponent],
  exports: [CurrencyInputComponent]
})
export class CurrencyInputModule { }
