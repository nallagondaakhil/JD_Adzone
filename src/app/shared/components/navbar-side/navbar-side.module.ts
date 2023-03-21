import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarSideComponent } from './navbar-side.component';
import { SelectListModule } from '../select-list/select-list.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';



@NgModule({
  declarations: [NavbarSideComponent],
  imports: [
    CommonModule,
    SelectListModule,
    NgxSliderModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    NavbarSideComponent,
    RouterModule,
  ],
  providers:[
    TranslateService
  ]
})
export class NavbarSideModule { }
