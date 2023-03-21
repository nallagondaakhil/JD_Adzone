import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './text-area.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TextAreaComponent],
  exports: [TextAreaComponent]
})
export class TextAreaModule { }
