import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppService } from './modules/poc/services/app.service';
import { NotificationService } from './modules/poc/services/notification.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CoreModule } from './core/core.module';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { SharedModule } from './shared/shared.module';
import { AlertsService } from './shared/services/alerts.service';
import { NavMenuService } from './shared/services/nav-menu.service';
import { StatusNotificationsService } from './shared/services/status-notifications.service';
import { MockDataService } from './modules/admin/services/mock-data-service';
import { MasterDataService } from './modules/admin/services/master-data.service';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { HomeComponent } from './modules/home/home.component';
import { UserService } from './core/services/user.service';
import { OktaAuthModule, OktaAuthService } from '@okta/okta-angular';
import { OktaService } from './core/services/oktaauth.service';
import { OktacallbackComponent } from './modules/oktacallback/oktacallback.component';
import { CommonSyncService } from './shared/services/common-sync.Service';
import { DocumentCategoryService } from './modules/adzone-admin/services/doc-cat.service';
import { UsermanagementService } from './modules/adzone-admin/services/usermanagement.service';
import { SubCatService } from './modules/adzone-admin/services/sub-cat.service';
import { DocumentTypeService } from './modules/adzone-admin/services/doc-type.service';
import { RoleService } from './modules/adzone-admin/services/role-management.service';
import { EndUserService } from './modules/adzone-admin/services/end-user.service';
import { BannerService } from './modules/adzone-admin/services/banner.service';
import { OrderAdminService } from './modules/adzone-admin/services/admin-order.service';
import { CategoryCountService } from './modules/adzone-admin/services/document-cat-count-report.service';
import { DealerManagementService } from './modules/adzone-admin/services/dealer-management.service';
import { AdminNotificationService } from './modules/adzone-admin/services/admin-notification.service';
import { RatingModule } from 'ng-starrating';
import { TemplatesService } from './modules/adzone-admin/services/templates.service';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NavigationService } from './shared/services/navigation.service';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient} from "@angular/common/http";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, HomeComponent, OktacallbackComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    OktaAuthModule,
    RatingModule,
    NgImageFullscreenViewModule,
    AngularMultiSelectModule,
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en-gb',
    }),
    ServiceWorkerModule.register(`service-worker.js`, {
      // enabled: environment.production,
      // // Register the ServiceWorker as soon as the app is stable
      // // or after 30 seconds (whichever comes first).
      // registrationStrategy: 'registerWhenStable:30000'
    }),
    // AngularFireDatabaseModule,
    // AngularFireAuthModule,
    // AngularFireMessagingModule,
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    AppService,
    UserService,
    NotificationService,
    NgxImageCompressService,
    ModalDialogService,
    AlertsService,
    NavMenuService,
    CommonSyncService,
    StatusNotificationsService,
    MasterDataService,
    MockDataService,
    OktaAuthService,
    OktaService,
    CurrencyPipe,
    TitleCasePipe,
    DocumentCategoryService,
    UsermanagementService,
    SubCatService,
    DocumentTypeService,
    RoleService,
    EndUserService,
    BannerService,
    OrderAdminService,
    CategoryCountService,
    DealerManagementService,
    AdminNotificationService,
    TemplatesService,
    TranslateService,
    NavigationService,
    {
      provide: APP_INITIALIZER,
      useFactory: userInfoServiceFactory,
      deps: [UserService],
      multi: true
    },
    {
      provide: SwRegistrationOptions,
      useFactory: ()=>({enabled: environment.production})
    },
    
  ],
  exports:[
    TranslateModule
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}

export function userInfoServiceFactory(service: UserService) {
  return () => service.setUserInfo();
}
