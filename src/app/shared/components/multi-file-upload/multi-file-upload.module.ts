import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiFileUploadComponent } from './multi-file-upload.component';
import { FormsModule } from '@angular/forms';
import { FileDragNDropDirective } from './file-drag-n-drop.directive';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoaderModule
  ],
  declarations: [MultiFileUploadComponent, FileDragNDropDirective],
  exports: [MultiFileUploadComponent]
})
export class MultiFileUploadModule { }
