import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileUploadComponent } from './components/dashboard/sub-components/file-upload/file-upload.component';
import { HomeComponent } from './components/dashboard/sub-components/home/home.component';
import { InputFormComponent } from './components/dashboard/sub-components/input-form/input-form.component';
import { NotificationComponent } from './components/dashboard/sub-components/notification/notification.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'file-upload', component: FileUploadComponent },
      { path: 'form', component: InputFormComponent },
      { path: '**', component: HomeComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PocRoutingModule {}
