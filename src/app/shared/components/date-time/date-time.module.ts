import 'flatpickr/dist/flatpickr.css'; // you may need to adjust the css import depending on your build tool
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { DateTimeComponent } from './date-time.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [DateTimeComponent],
  imports: [CommonModule, FormsModule, Ng2FlatpickrModule, CoreModule],
  exports: [DateTimeComponent],
})
export class DateTimeModule {}
