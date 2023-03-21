import { EditTemplateComponent } from './edit-template/edit-template.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentCategoryComponent } from './document-category/document-category.component';
import { DocumentSubCategoryComponent } from './document-sub-category/document-sub-category.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { VendorManagementCopyComponent } from './user-copy-management/user-management.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { EndUserManagementComponent } from './end-user-management/end-user-management.component';
import { DetailedViewComponent } from './end-user-management/sub-components/detailed-view/detailed-view.component';
import { ShoppingCartComponent } from './end-user-management/sub-components/shopping-cart/shopping-cart.component';
import { AdminOrderListComponent } from './admin-order-list/admin-order-list.component';
import { AdminViewOrderComponent } from './admin-order-list/sub-components/admin-view-order/admin-view-order.component';
import { MyOrdersComponent } from './end-user-management/sub-components/my-orders/my-orders.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { BannerMasterComponent } from './banner-master/banner-master.component';
import { PrintableMaterialComponent } from './end-user-management/sub-components/printable-material/printable-material.component';
import { WishListComponent } from './end-user-management/sub-components/wish-list/wish-list.component';
import { DocumentCategoryCountComponent } from './document-category-count/document-category-count.component';
import { DealerReportComponent } from './dealer-report/dealer-report.component';
import { DocumentUploadedReportComponent } from './document-uploaded-report/document-uploaded-report.component';
import { DealerOrderComponent } from './dealer-order/dealer-order.component';
import { DocumentDownloadedReportComponent } from './document-downloaded-report/document-downloaded-report.component';
import { DealerManagementComponent } from './dealer-management/dealer-management.component';
import { UserActivityReportComponent } from './user-activity-report/user-activity-report.component';
import { NotificationComponent } from './notification/notification.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FeedBackComponent } from './feed-back/feed-back.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MyTemplatesComponent } from './my-templates/my-templates.component';
import { PdfFullViewComponent } from './end-user-management/sub-components/pdf-full-view/pdf-full-view.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
let data = localStorage.getItem('USERACCESSINFO');
let url:any;
let routes: Routes
if(data == 'Super Admin'){
  url = 'dashboard'
}
else if(data == 'Dealer'){
  url = 'end-user-management'

}
  routes = [
    {
      path: '', 
      // component: AdminDashboardComponent,
      children: [
    { path: 'document-category', component: DocumentCategoryComponent },
    {path:'document',component:DocumentTypeComponent},
    { path: 'document-sub-category', component: DocumentSubCategoryComponent },
    { path: 'user-management', component: VendorManagementCopyComponent },
    { path: 'vendor-management', component: VendorManagementComponent },
    { path: 'role-management', component: RoleManagementComponent },
    { path: 'wish-list', component: WishListComponent },
    { path: 'end-user-management', component: EndUserManagementComponent },
    { path: 'shopping-cart', component: ShoppingCartComponent },
    { path: 'my-orders', component: MyOrdersComponent },
    { path: 'detailed-view/:id/:id', component: DetailedViewComponent },
    { path: 'order-list', component: AdminOrderListComponent },
    { path: 'manage-product', component: ManageProductComponent },
    { path: 'banner-management', component: BannerMasterComponent },
    { path: 'printable-material', component: PrintableMaterialComponent },
    { path: 'document-count-category', component: DocumentCategoryCountComponent},
    {path:'dealer-report',component:DealerReportComponent},
    {path:'document-uploaded-report',component:DocumentUploadedReportComponent},
    {path:'dealer-order',component:DealerOrderComponent},
    { path: 'user-activity', component: UserActivityReportComponent},
    {path:'document-downloaded-report',component:DocumentDownloadedReportComponent},
    { path: 'dealer-management', component: DealerManagementComponent},
    {path:'notification',component:NotificationComponent},
    {path:'contact-us',component:ContactUsComponent},
    {path:'feed-back',component:FeedBackComponent},
    {path:'dashboard',component:AdminDashboardComponent},
    {path:'edit-template',component:EditTemplateComponent},
    {path:'my-templates',component:MyTemplatesComponent},
    {path:'pdf-view-full/:documentId/:documentFileId',component:PdfFullViewComponent},
    {path:'fileupload',component:FileuploadComponent},
    {
      path: '',
      pathMatch: 'full',
      redirectTo: url
    }
    ],
  },
  ];
// }
// else if(data == 'Dealer'){
//   routes = [
//     {
//       path: '', 
//       // component: EndUserManagementComponent,
//       children: [
//     // { path: 'document-category', component: DocumentCategoryComponent },
//     // {path:'document',component:DocumentTypeComponent},
//     // { path: 'document-sub-category', component: DocumentSubCategoryComponent },
//     // { path: 'user-management', component: UserManagementComponent },
//     // { path: 'vendor-management', component: VendorManagementComponent },
//     // { path: 'role-management', component: RoleManagementComponent },
//     { path: 'wish-list', component: WishListComponent },
//     { path: 'end-user-management', component: EndUserManagementComponent },
//     { path: 'shopping-cart', component: ShoppingCartComponent },
//     { path: 'my-orders', component: MyOrdersComponent },
//     { path: 'detailed-view/:id/:id', component: DetailedViewComponent },
//     // { path: 'order-list', component: AdminOrderListComponent },
//     // { path: 'manage-product', component: ManageProductComponent },
//     // { path: 'banner-management', component: BannerMasterComponent },
//     // { path: 'printable-material', component: PrintableMaterialComponent },
//     // { path: 'document-count-category', component: DocumentCategoryCountComponent},
//     // {path:'dealer-report',component:DealerReportComponent},
//     // {path:'document-uploaded-report',component:DocumentUploadedReportComponent},
//     // {path:'dealer-order',component:DealerOrderComponent},
//     // { path: 'user-activity', component: UserActivityReportComponent},
//     // {path:'document-downloaded-report',component:DocumentDownloadedReportComponent},
//     // { path: 'dealer-management', component: DealerManagementComponent},
//     {path:'notification',component:NotificationComponent},
//     {path:'contact-us',component:ContactUsComponent},
//     {path:'feed-back',component:FeedBackComponent},
//     // {path:'dashboard',component:AdminDashboardComponent},
//     // {path:'edit-template',component:EditTemplateComponent},
//     // {path:'my-templates',component:MyTemplatesComponent},
//     // {path:'pdf-view-full/:documentId/:documentFileId',component:PdfFullViewComponent}
//   { path: '/master', redirectTo: '/end-user-management' }

//     ]
    
//   },

//   ];
// }


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdzoneAdminRoutingModule { }
