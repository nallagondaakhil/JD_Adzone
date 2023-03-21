import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarTopComponent } from './navbar-top.component';
import { PipesModule } from '../../pipes/pipes.module';
import {RouterModule} from '@angular/router';
import { LangugaePreferenceComponent } from './models/langugae-preference/langugae-preference.component';
import { ApplyComponent } from './models/apply/apply.component';
import { SavePreferenceComponent } from './models/save-preference/save-preference.component';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    NavbarTopComponent,
    LangugaePreferenceComponent,
    ApplyComponent,
    SavePreferenceComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    RouterModule,
    TranslateModule,
    PdfViewerModule
  ],
  exports: [
    NavbarTopComponent,
    ApplyComponent,
    SavePreferenceComponent,
    
  ],
  providers:[
    TranslateService
  ]
})
export class NavbarTopModule { }
