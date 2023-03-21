import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiFileDownloadComponent } from './multi-file-download.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MultiFileDownloadComponent],
  exports: [MultiFileDownloadComponent]
})
export class MultiFileDownloadModule { }
