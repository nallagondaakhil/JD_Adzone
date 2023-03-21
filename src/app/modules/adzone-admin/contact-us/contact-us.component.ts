import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { RolePermissionService } from '../services/role-permission.service';
@Component({
  selector: 'jd-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  isAdmin:boolean = false;
  isSubRegionAdmin:boolean = false;
  isVendor:boolean = false;
  isJdUser:boolean = false;
  isDealer:boolean = false;
  dealerView = false;
  viewAccess:any;
  dashBoardAccess:any;
  roleId:any;
  constructor(
    private userService: UserService,
    private rolepermission:RolePermissionService,
    public translate:TranslateService) { }

  async ngOnInit(): Promise<void> {
    let appliedLang = localStorage.getItem('Applylanguage')
    let preLang = localStorage.getItem('preLanguage')
    if(appliedLang){
      console.log('applied',appliedLang)
      this.translate.use(appliedLang);
    }
    else if(preLang){
      this.translate.use(preLang);
    }
    this.isAdmin = this.userService.isAdmin();
    this.isSubRegionAdmin = this.userService.isSubRegionAdmin();
    this.isVendor = this.userService.isVendor();
    this.isJdUser = this.userService.isJdUser();
    this.isDealer = this.userService.isDealer();
    this.roleId = this.userService.getUserRoleId();
    let view = JSON.parse(localStorage.getItem('dealerView'))
    this.dealerView = view;
    await this.rolepermission.getPermissionForModule(this.roleId,"Dashboard");
    await this.rolepermission.getPermissionForModule(this.roleId,"Dealer View");

    this.viewAccess = await this.rolepermission.getRoleViewAccess();
    this.dashBoardAccess =this.viewAccess.roleType;
  }
  goBack(){
    localStorage.removeItem('currentMenuId');
    localStorage.removeItem('currentsideMenuId');
  }
}
