
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
// import { ModelMasterComponent } from './model-master/model-master.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  declarations: [
    AdminComponent,
    // ModelMasterComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    CoreModule,
    SharedModule,
    NgxDocViewerModule
  ],
  providers: [

  ],
})
export class AdminModule {}
