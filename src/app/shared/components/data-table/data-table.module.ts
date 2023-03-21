import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table.component';
import { DataTablesModule } from 'angular-datatables';
import { PipesModule } from '../../pipes/pipes.module';
import { FilterComponent } from './sub-components/filter/filter.component';
import { SelectListModule } from '../select-list/select-list.module';
import { DateTimeModule } from '../date-time/date-time.module';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';







@NgModule({
  declarations: [DataTableComponent, FilterComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    PipesModule,
    SelectListModule,
    DateTimeModule,
    FormsModule,
    NgxSliderModule
    
  ],
  exports: [DataTableComponent, FilterComponent]
})
export class DataTableModule { }
