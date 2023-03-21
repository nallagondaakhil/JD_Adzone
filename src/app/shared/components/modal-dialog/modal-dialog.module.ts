import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDialogComponent } from './modal-dialog.component';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalDialogComponent],
  imports: [CommonModule, FormsModule],
  exports: [ModalDialogComponent],
})
export class ModalDialogModule {}
