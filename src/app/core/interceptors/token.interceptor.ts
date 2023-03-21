import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AlertsService, AlertType } from "src/app/shared/services/alerts.service";
import { CookieUtil } from "src/app/shared/utils/cookie.util";
import { AuthService } from "../services/auth.service";
import { OktaService } from "../services/oktaauth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  redirect=0;

  constructor(public auth: AuthService,public router: Router,private alertService: AlertsService,private okta:OktaService) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    //const refreshToken = this.auth.getRefreshtoken();
    const refreshToken = this.okta.getRefreshtoken();
    if (request.headers.get('skipToken')) {
       return next.handle(request);
      // return next.handle(request).pipe(tap(() => { }, (err: any) => {
      //   if
      //     (err instanceof HttpErrorResponse) {
      //     if (err.status !== 401) {
      //       return;
      //     }
      //     else {
      //       this.router.navigate(['login']);
      //     }
      //   }
      // }));
    }
    // if(token!=null){
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });
  // }
    if(CookieUtil.getCookie('impersonateracfId')){ 
      request = request.clone({
        headers : request.headers.set('X-Impersonate',  CookieUtil.getCookie('impersonateracfId'))
      });


     }
    //  console.log(token,refreshToken);
//     if(request.headers.get('X-Impersonate')){
// //console.log(request.headers.get('X-Impersonate') + "impersonate" );
//     }
    //return next.handle(request);

    return next.handle(request).pipe(tap(() => { }, (err: any) => {
      if
        (err instanceof HttpErrorResponse) {
        if ((err.status !== 401) && (err.status !== 502)) {
          // alert(err);
          return;
        }
        else {
          //  console.log(err)
          // if(this.redirect==0)
          // {
          //this.alertService.show('Session Expired', AlertType.Critical);
          this.auth.refreshToken({refresh_token: refreshToken})
           .subscribe((res)=>{
              // console.log(res);
            //  console.log("Token refreshed");
           });
           //console.log(err,"401");
            // setTimeout(() => {
            //   // console.log(err,"401");
            //   this.okta.logout();
            //   // subscribe(()=>{
            //   //   location.reload();
            //   // })

            // }, 3000);
             this.redirect =1;

          // }else{
          //  this.okta.logout();
          // }


        }
      }
    }));

  }
}