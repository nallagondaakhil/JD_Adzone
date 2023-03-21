import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isAdmin = this.userService.isAdmin();
  isSubRegionAdmin = this.userService.isSubRegionAdmin();
  @Output() actioncontactUsEmit = new EventEmitter<any>();
  footerManuals:any;
  termsOfUseLink:any;
  privacyPolicyLink:any;
  constructor(private userService: UserService,private router:Router,public translate:TranslateService ) { }

  ngOnInit(): void {
    this.setUpManuals()
  }

  async setUpManuals(){
    const RacfId = this.userService.getRacfId();
    this.footerManuals = await this.userService.footerManuals(RacfId);
    this.termsOfUseLink = this.footerManuals.termsOfUseLink
    this.privacyPolicyLink = this.footerManuals.privacyPolicyLink
  }
  //redirectToContactus()
  redirectToContactus(){
    // localStorage.setItem('currentsideMenuId','Contact Us');

    localStorage.setItem('currentMenuId',null);
    window.location.href = '/master/contact-us';
    // location.assign("/master/contact-us");
    // this.router.navigate(['/master/contact-us']);
   
  }
  clearFeedbackSideMenu(){
    localStorage.setItem('currentMenuId',null);
    localStorage.setItem('submenuValue','Feedback');
    this.router.navigate(['/master/feed-back']);
    // localStorage.removeItem('currentMenuId');
    // localStorage.removeItem('currentsideMenuId');
  }

}
