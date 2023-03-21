import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DropdownComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [DropdownComponent]
})
export class DropdownModule { }
