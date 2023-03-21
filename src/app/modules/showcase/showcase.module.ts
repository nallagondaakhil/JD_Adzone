import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseRoutingModule } from './showcase-routing.module';
import { ShowcaseComponent } from './showcase.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { MockDataService } from './mock-data.service';

@NgModule({
  declarations: [ShowcaseComponent],
  imports: [CommonModule, ShowcaseRoutingModule, SharedModule],
  exports: [ShowcaseComponent],
  providers: [MockDataService]
})
export class ShowcaseModule {}
