
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdzoneAdminRoutingModule } from './adzone-admin-routing.module';
import { DocumentCategoryComponent } from './document-category/document-category.component';
import { FormsModule } from '@angular/forms';
// import { AdminRoutingModule } from '../admin/admin-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AddEditDocumentCategoryComponent } from './document-category/sub-components/add-edit-document-category/add-edit-document-category.component';
import { DocumentSubCategoryComponent } from './document-sub-category/document-sub-category.component';
import { AddEditDocumentSubCategoryComponent } from './document-sub-category/sub-components/add-edit-document-sub-category/add-edit-document-sub-category.component';
import { MockDataService } from '../showcase/mock-data.service';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddEditUserComponent } from './user-management/sub-components/add-edit-user/add-edit-user.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { AddEditDocumentTypeComponent } from './document-type/sub-components/add-edit-document-type/add-edit-document-type.component';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { AddEditVendorComponent } from './vendor-management/sub-components/add-edit-vendor/add-edit-vendor.component';
import { AddEditVendorCopyComponent } from './user-copy-management/sub-components/add-edit-vendor/add-edit-vendor.component';

import { EndUserManagementComponent } from './end-user-management/end-user-management.component';
import { UploadDocumentComponent } from './document-type/sub-components/upload-document/upload-document.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { AddEditRoleManagementComponent } from './role-management/sub-components/add-edit-role-management/add-edit-role-management.component';
import { ShoppingCartComponent } from './end-user-management/sub-components/shopping-cart/shopping-cart.component';
import { DetailedViewComponent } from './end-user-management/sub-components/detailed-view/detailed-view.component';
import { AdminOrderListComponent } from './admin-order-list/admin-order-list.component';
import { AdminViewOrderComponent } from './admin-order-list/sub-components/admin-view-order/admin-view-order.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MyOrdersComponent } from './end-user-management/sub-components/my-orders/my-orders.component';
import { AddEditFeedbackComponent } from './end-user-management/sub-components/feedback/add-edit-feedback/add-edit-feedback.component';
import { ShareUrlComponent } from './end-user-management/sub-components/share-url/share-url.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { AddEditProductComponent } from './manage-product/sub-components/add-edit-product/add-edit-product.component';
import { UploadProductComponent } from './manage-product/sub-components/upload-product/upload-product.component';
import { BannerMasterComponent } from './banner-master/banner-master.component';
import { AddEditBannerComponent } from './banner-master/sub-components/add-edit-banner/add-edit-banner.component';
import { CarouselModule } from 'primeng/carousel';
import { PrintableMaterialComponent } from './end-user-management/sub-components/printable-material/printable-material.component';
import { WishListComponent } from './end-user-management/sub-components/wish-list/wish-list.component';
import { DealerManagementComponent } from './dealer-management/dealer-management.component';
import { BulkUploadUserComponent } from './user-management/sub-components/bulk-upload-user/bulk-upload-user.component';
import { BulkUploadUserCopyComponent } from './user-copy-management/sub-components/bulk-upload-vendor/bulk-upload-vendor.component';
import { BulkUploadVendorComponent } from './vendor-management/sub-components/bulk-upload-vendor/bulk-upload-vendor.component';
import { UserActivityReportComponent } from './user-activity-report/user-activity-report.component';
import { DocumentCategoryCountComponent } from './document-category-count/document-category-count.component';
import { DealerReportComponent } from './dealer-report/dealer-report.component';
import { DocumentUploadedReportComponent } from './document-uploaded-report/document-uploaded-report.component';
import { DealerOrderComponent } from './dealer-order/dealer-order.component';
import { DocumentDownloadedReportComponent } from './document-downloaded-report/document-downloaded-report.component';
import { NotificationComponent } from './notification/notification.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { VendorManagementCopyComponent } from './user-copy-management/user-management.component';

import { EditTemplateComponent } from './edit-template/edit-template.component';
import { FeedBackComponent } from './feed-back/feed-back.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'
import { RatingModule } from 'ng-starrating';
import { ShowImageComponent } from './end-user-management/sub-components/show-image/show-image.component';
import { MyTemplatesComponent } from './my-templates/my-templates.component';

import { EditImageComponent } from './edit-template/sub-component/edit-image/edit-image.component';
import { ImageGalaryComponent } from './edit-template/sub-component/image-galary/image-galary.component';

import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PdfFullViewComponent } from './end-user-management/sub-components/pdf-full-view/pdf-full-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditImageCollagesComponent, ResizableTextAreaDirective } from './edit-template/sub-component/edit-image-collages/edit-image-collages.component';
import { PreviewDocumentComponent } from './document-type/sub-components/preview-document/preview-document.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { PreviewBannerComponent } from './banner-master/sub-components/preview-banner/preview-banner.component';
import {FileuploadComponent} from './fileupload/fileupload.component'
import { FileuploadService } from './fileupload/fileupload.service';
import { PreviewTableComponent } from './document-type/sub-components/preview-table/preview-table.component';
import { TranslateModule,TranslateService } from '@ngx-translate/core';

import { UserAccessControlComponent } from './user-management/sub-components/user-access-control/user-access-control.component';
import { UserAccessControlCopyComponent } from './user-copy-management/sub-components/user-access-control/user-access-control.component';
@NgModule({
  declarations: [
    DocumentCategoryComponent,
    AddEditDocumentCategoryComponent,
    DocumentSubCategoryComponent,
    AddEditDocumentSubCategoryComponent,
    UserManagementComponent,
    AddEditUserComponent,
    DocumentTypeComponent,
    AddEditDocumentTypeComponent,
    VendorManagementComponent,
    AddEditVendorComponent,
    AddEditVendorCopyComponent,
    UserAccessControlCopyComponent,
    UploadDocumentComponent,
    RoleManagementComponent,
    AddEditRoleManagementComponent,
    EndUserManagementComponent,
    VendorManagementCopyComponent,
    UploadDocumentComponent,
    WishListComponent,
    MyOrdersComponent,
    ShoppingCartComponent,
    DetailedViewComponent,
    AdminOrderListComponent,
    AdminViewOrderComponent,
    AddEditFeedbackComponent,
    ShareUrlComponent,
    ManageProductComponent,
    AddEditProductComponent,
    UploadProductComponent,
    BannerMasterComponent,
    AddEditBannerComponent,
    PrintableMaterialComponent,
    DealerManagementComponent,
    BulkUploadUserComponent,
    BulkUploadVendorComponent,
    UserActivityReportComponent,
    DocumentCategoryCountComponent,
    DealerReportComponent,
    DocumentUploadedReportComponent,
    DealerOrderComponent,
    DocumentDownloadedReportComponent,
    NotificationComponent,
    ContactUsComponent,
    EditTemplateComponent,
    FileuploadComponent,
    FeedBackComponent,
    AdminDashboardComponent,
    ShowImageComponent,
    MyTemplatesComponent,
    BulkUploadUserCopyComponent,
    ResizableTextAreaDirective, EditImageComponent, ImageGalaryComponent, PdfFullViewComponent, EditImageCollagesComponent, PreviewDocumentComponent, PreviewBannerComponent,PreviewTableComponent, UserAccessControlComponent
  ],
  imports: [
    CommonModule,
    AdzoneAdminRoutingModule,
    FormsModule,
    // AdminRoutingModule,
    CoreModule,
    SharedModule,
    NgxDocViewerModule,
    NgxSliderModule,
    CarouselModule,
    FormsModule,
    NgxPaginationModule,
    RatingModule,
    NgImageFullscreenViewModule,
    AngularMultiSelectModule,
    PdfViewerModule,
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule
    ],
  exports:[
    TranslateModule
  ],
  providers: [
    MockDataService,
    FileuploadService,
    DatePipe,
    TranslateService
  ],
})
export class AdzoneAdminModule { }
