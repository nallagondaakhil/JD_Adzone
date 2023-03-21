import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PocRoutingModule } from './poc-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/dashboard/sub-components/home/home.component';
import { NotificationComponent } from './components/dashboard/sub-components/notification/notification.component';
import { FileUploadComponent } from './components/dashboard/sub-components/file-upload/file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { InputFormComponent } from './components/dashboard/sub-components/input-form/input-form.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    NotificationComponent,
    FileUploadComponent,
    InputFormComponent,
  ],
  imports: [
    CommonModule,
    PocRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    FileUploadModule,
    TranslateModule
  ],
})
export class PocModule {}
