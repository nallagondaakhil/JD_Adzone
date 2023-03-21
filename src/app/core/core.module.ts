import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TranslatePipe } from './translate/translate.pipe';
import { TranslationService } from './translate/translate.service';
import { RouterModule } from '@angular/router';
import { PushMessageService } from './services/push-message.service';
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { FormsModule } from '@angular/forms';
import { ImpersonateUserComponent } from './authentication/login/sub-components/impersonate-user/impersonate-user.component';
import { ApplyComponent } from '../shared/components/navbar-top/models/apply/apply.component';
import { LangApplyComponent } from './header/modals/lang-apply/lang-apply.component';
import { LangSavePreferenceComponent } from './header/modals/lang-save-preference/lang-save-preference.component';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, LoginComponent, 
    ImpersonateUserComponent, LangApplyComponent, LangSavePreferenceComponent],
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    TranslateModule,
    PdfViewerModule
  ],
  exports: [
    FooterComponent, 
    HeaderComponent,  
    LoginComponent,
  ],
  providers: [
    PushMessageService,
    AuthGuardService,
    AuthService,
    TranslateService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
})
export class CoreModule {}
