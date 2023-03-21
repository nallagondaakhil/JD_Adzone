import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/authentication/login/login.component';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { HomeComponent } from './modules/home/home.component';
import { OktacallbackComponent } from './modules/oktacallback/oktacallback.component';
import { ImpersonateUserComponent } from './core/authentication/login/sub-components/impersonate-user/impersonate-user.component';
const routes: Routes = [
  {
    path: '', children: [

      { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuardService] },
      { path: 'master', loadChildren: () => import('./modules/adzone-admin/adzone-admin.module').then(m => m.AdzoneAdminModule), canActivate: [AuthGuardService] },
      { path: 'login', component: LoginComponent },
      { path: 'home', component: OktacallbackComponent },
      { path: 'homepage', component: HomeComponent, canActivate: [AuthGuardService] },
      { path: 'impersonate', component: ImpersonateUserComponent, canActivate: [AuthGuardService] },
      { path: 'poc', loadChildren: () => import('./modules/poc/poc.module').then(m => m.PocModule), canActivate: [AuthGuardService] },
      { path: 'showcase', loadChildren: () => import('./modules/showcase/showcase.module').then(m => m.ShowcaseModule), canActivate: [AuthGuardService] },
      { path: '**', redirectTo: '/login' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
