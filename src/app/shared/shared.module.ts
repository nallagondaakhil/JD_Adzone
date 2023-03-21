import { DropdownModule } from './components/dropdown/dropdown.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarTopModule } from './components/navbar-top/navbar-top.module';
import { PipesModule } from './pipes/pipes.module';
import { NavbarSideModule } from './components/navbar-side/navbar-side.module';
import { CoreModule } from '../core/core.module';
import { SelectListModule } from './components/select-list/select-list.module';
import { ModalDialogModule } from './components/modal-dialog/modal-dialog.module';
import { DateTimeModule } from './components/date-time/date-time.module';
import { AlertsModule } from './components/alerts/alerts.module';
import { BreadcrumbsModule } from './components/breadcrumbs/breadcrumbs.module';
import { DataTableModule } from './components/data-table/data-table.module';
import { TextBoxModule } from './components/text-box/text-box.module';
// import { FileUplodeModule } from './components/file-uplode/file-uplode.module';
import { TextAreaModule } from './components/text-area/text-area.module';
import { LoaderModule } from './components/loader/loader.module';
import { JdNameValidatorDirective } from './directives/jd-name-validator.directive';
import { JdAlphaNumericValidatorDirective } from './directives/jd-alfa-numeric-validator.directive';
import { CurrencyInputModule } from './components/currency-input/currency-input.module';
import { MultiFileDownloadModule } from './components/multi-file-download/multi-file-download.module';
import { MultiFileUploadModule } from './components/multi-file-upload/multi-file-upload.module';
import { ToggleModule } from './components/toggle/toggle.module';
import { QuillModule } from 'ngx-quill';
import { FormErrorComponent } from './components/form-error/form-error.component';
@NgModule({
  declarations: [
    JdNameValidatorDirective,
    JdAlphaNumericValidatorDirective,
    FormErrorComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule, 
    ReactiveFormsModule,
    NavbarTopModule,
    NavbarSideModule,
    PipesModule,
    DropdownModule,
    SelectListModule,
    ModalDialogModule,
    DateTimeModule,
    AlertsModule,
    BreadcrumbsModule,
    DataTableModule,
    TextBoxModule,
    // FileUplodeModule,
    TextAreaModule,
    LoaderModule,
    CurrencyInputModule,
    MultiFileDownloadModule,
    MultiFileUploadModule,
    ToggleModule,
    QuillModule.forRoot()
  ],
  exports: [
    FormsModule, 
    ReactiveFormsModule,
    NavbarTopModule,
    NavbarSideModule,
    DropdownModule,
    SelectListModule,
    PipesModule,
    ModalDialogModule,
    DateTimeModule,
    AlertsModule,
    BreadcrumbsModule,
    DataTableModule,
    TextBoxModule,
    // FileUplodeModule,
    TextAreaModule,
    LoaderModule,
    JdNameValidatorDirective,
    JdAlphaNumericValidatorDirective,
    CurrencyInputModule,
    
    MultiFileDownloadModule,
    MultiFileUploadModule,
    ToggleModule,
    QuillModule,
    FormErrorComponent
  ],
})
export class SharedModule {}
