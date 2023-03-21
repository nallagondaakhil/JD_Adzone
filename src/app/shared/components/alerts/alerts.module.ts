import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';
import { CoreModule } from 'src/app/core/core.module';
import { AlertListComponent } from './alert-list/alert-list.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [AlertsComponent, AlertListComponent],
  imports: [CommonModule, CoreModule,TranslateModule],
  exports: [AlertsComponent, AlertListComponent],
  providers:[TranslateService]
})
export class AlertsModule {}
