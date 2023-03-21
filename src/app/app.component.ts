import { SwUpdate } from '@angular/service-worker';
import {
  Modal,
  ModalDialogService,
  ModalType,
} from './shared/services/modal-dialog.service';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
  VERSION,
  EventEmitter
} from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { environment } from 'src/environments/environment';
import { PushMessageService } from './core/services/push-message.service';
import { Alerts, AlertsService, AlertType } from './shared/services/alerts.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NavbarMenuItem } from './shared/components/navbar-top/models/navbar-menu-item.model';
import { Router, NavigationEnd } from '@angular/router';
import { NavMenuModel, NavMenuService } from './shared/services/nav-menu.service';
import { MenuUtil } from './shared/utils/menu.util';
import { StatusNotificationsService } from './shared/services/status-notifications.service';
import { AuthService } from './core/services/auth.service';
import { ApiErrorUtil } from './shared/utils/api-error.util';
import { UserService } from './core/services/user.service';
import { OktaService } from './core/services/oktaauth.service';
import { DocumentTypeService } from './modules/adzone-admin/services/doc-type.service';
import { MasterDataService } from './modules/admin/services/master-data.service';
import { MasterDataModel } from './modules/admin/models/master-data.model';
import { EndUserMasterModel, EndUserPayLoad,MyOrderPayload } from './modules/adzone-admin/models/end-user-master.model';
import { EndUserService } from './modules/adzone-admin/services/end-user.service';
import { EndUserModelMapper } from './modules/adzone-admin/end-user-management/models/end-user-view.model';
import { IndependentcomponentserviceService } from './shared/services/independentcomponentservice.service';
import { DataLoadParams } from './shared/components/data-table/models/data-table-model';
import { OrdercomponentService } from './shared/services/ordercomponent.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { RolePermissionService } from './modules/adzone-admin/services/role-permission.service';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationService } from './shared/services/navigation.service';
const publicKey = environment.notificationKey;
@HostListener('window:popstate', ['$event'])

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  modalParams: Modal;
  alertParams: Alerts;
  deviceInfo: {};
  @Input('menuList') menuItems: any = [];
  @Input('mobmenuList') mobmenuItems: any = [];
  @Input('subMenuItem') subMenuItem: any = [];
  @Input('subchildMenuFourthItem') subchildMenuFourthItem: any = [];
  @Input('listModels') listModel: any = [];
  topMenuItems: NavbarMenuItem[] = [];
  sideMenuItems: NavbarMenuItem[] = [];
  topmenuOptions: MasterDataModel[] = [];
  currentItem: NavbarMenuItem[] = [];
  @Input() model: EndUserPayLoad;
  @Input() orderModel: MyOrderPayload;
  loading = false;
  dealerView = false;
  roleName: string;
  isAdmin:boolean;
  FilterBody: DataLoadParams ;
  isSubRegionAdmin:boolean;
  roleId: string;
  hideSideBar = true;
  notEndUser = true;
  showManageFilter = true;
  currentMenuId:any;
  pathArray:any;
  showsidemenu:any;
  headerMenu:any;
  dealerAdmin:any;
  docOptions:any;
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;
  isAdminlogin = this.userService.isAdmin();
  isVendor = this.userService.isVendor();
  isJdUser = this.userService.isJdUser();
  isDealer = this.userService.isDealer();
  viewAccess:any;
  dashBoardAccess:any;
  userToken:any;
  previousUrl: string = null;
  currentUrl: string = null;
  stepper: any;
  updateMenu:Subscription;
  EventEmitterpageUrl: string;
  activeMenuUrl: any;
  constructor(
    private modalService: ModalDialogService,
    private changeDetectRef: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private pushMessageService: PushMessageService,
    private update: SwUpdate,
    private alertService: AlertsService,
    private router: Router,
    private menuService: NavMenuService,
    private notificationsService: StatusNotificationsService,
    private userService: UserService,
    private authService: AuthService,
    private okta: OktaService,
    private docService:DocumentTypeService,
    private masterdataservice:MasterDataService,
    private enduserservice:EndUserService,
    private intservice:IndependentcomponentserviceService,
    private orderService:OrdercomponentService,
    private idle: Idle,
    keepalive: Keepalive,
    cd: ChangeDetectorRef,
    private rolepermission:RolePermissionService,
    public navigation: NavigationService
  ) {

    this.routingPermission();
   
    this.setUpModalService();
    this.setUpAlertService();
    this.detectClientDevice();
   
    const conn = (navigator as any).connection;
    if (conn) {
      const effectiveType = conn.effectiveType;
    }
    idle.setIdle(7200); // how long can they be inactive before considered idle, in seconds 3480
    idle.setTimeout(60); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active
    
    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    // do something when the user has timed out
    idle.onTimeout.subscribe((err) => {
      var RacfId = this.userService.getRacfId();
      var userId = this.userService.getUserId();
      this.authService.dealerLogout(RacfId,userId);
     this.okta.logout();
      this.modalService.publisher.next(null);
     // this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
    });
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => {
      this.countdown = seconds;
      this.idleState = "TIMED_OUT";
      this.modalService.show({
        title: `Please sign in again`,
        message: `You have been inactive for more than 2 hours. Hence you will be logged out automatically for security reasons.`,
        // okText: `Sign in again (${this.countdown})`,
        okText: `Sign in again`,
        okCallback: async () => {
          try {
            var RacfId = this.userService.getRacfId();
            var userId = this.userService.getUserId();
            this.authService.dealerLogout(RacfId,userId);
            this.okta.logout();
            this.modalService.publisher.next(null);
          } catch (error) {
           
            //this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update Business Place', AlertType.Critical);
          }
        },
        //cancelText: 'Continue',
        cancelCallback: () => {
          this.okta.logout();
          // this.reset();
          this.modalService.publisher.next(null);
        },
        closeCallback:()=>{
          // console.log('close')
          var RacfId = this.userService.getRacfId();
            var userId = this.userService.getUserId();
            this.authService.dealerLogout(RacfId,userId);
            this.okta.logout();
            this.modalService.publisher.next(null);
        },
        modalType: ModalType.warning,
        isSecondModal: false,
        msgRed: false,
        btnCenter: false,
      });
    });

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(10); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => {
      this.lastPing = new Date();
    }); // do something when it pings
   // this.setTopMenuItems();
    // this.setSideMenuItems();
  }
  
  async ngOnInit() {
    this.pathArray = window.location.pathname.split('/');
     if(this.pathArray[2] == "end-user-management"){
      localStorage.setItem('dealerView','true')
    }
     if(this.pathArray[2] == "shopping-cart"){
  //     localStorage.setItem('dealerView','true');
  //     localStorage.removeItem('currentheaderMenuId');
  //     localStorage.removeItem('menu ID');
      localStorage.removeItem('page');
      localStorage.removeItem('sortById');
      localStorage.removeItem('language');
      localStorage.removeItem('fileType');
    localStorage.removeItem('searchData');
    // localStorage.removeItem('currentsideMenuId');
    // localStorage.removeItem('currentMenuId');
    }
    if(this.pathArray[2] == 'wish-list'){

  //     localStorage.setItem('dealerView','true');
  //     localStorage.removeItem('currentheaderMenuId');
  //     localStorage.removeItem('menu ID');
      localStorage.removeItem('page');
      localStorage.removeItem('sortById');
      localStorage.removeItem('language');
      localStorage.removeItem('fileType');
    localStorage.removeItem('searchData');
    // localStorage.removeItem('currentsideMenuId');
    // localStorage.removeItem('currentMenuId');

    }

    let menuValue = localStorage.getItem('menuValue');
    let submenuValue = localStorage.getItem('submenuValue');
    console.log('submenu',submenuValue)
    if(menuValue && submenuValue){
      if(this.pathArray[2] != 'end-user-management' && this.pathArray[2] != 'wish-list' 
      && this.pathArray[2] != 'shopping-cart' && this.pathArray[2] != 'my-orders' 
      && this.pathArray[2] != 'notification' 
      && this.pathArray[2] != 'feed-back' && this.pathArray[2] != 'contact-us'){
      if(this.pathArray[2] != "end-user-management"){
        if(menuValue != undefined && menuValue != null && menuValue != ''){
          localStorage.setItem('currentMenuId',menuValue);
          localStorage.removeItem('menuValue');
          localStorage.removeItem('currentheaderMenuId');
          localStorage.removeItem('menu ID');
        }if(submenuValue != undefined && submenuValue != null && submenuValue != ''){
          localStorage.setItem('currentsideMenuId',submenuValue);
          localStorage.removeItem('submenuValue');
        }
      }
    }
      else{
        localStorage.setItem('dealerView','true')
        localStorage.removeItem('currentMenuId');
        localStorage.removeItem('currentsideMenuId');
      }

    }
    this.reset();
    this.roleName = this.userService.userInfo?.role;
    this.roleId = this.userService.userInfo?.roleId;
    this.model = this.model || {} as any;
    this.orderModel = this.orderModel || {} as any;
    this.model.documentCategoryId = this.model?.documentCategoryId || null; 
    this.model.documentSubCategoryId = this.model?.documentSubCategoryId || null;
    this.model.documentCategoryName = this.model?.documentCategoryName || null;
    this.model.documentSubCategoryName = this.model?.documentSubCategoryName || null;
    this.model.documentSubChildCategoryId = this.model?.documentSubChildCategoryId || null;
    this.model.documentSearch =this.model?.documentSearch || null;
    this.model.documentSortId =this.model?.documentSortId || null;
    this.model.documentFileType =this.model?.documentFileType || null;
    this.model.documentSortBy = this.model?.documentSortBy || null;
    this.model.languageId  = this.model?.languageId  || null;
    this.orderModel.orderStatusList = this.orderModel?.orderStatusList || null;
    this.orderModel.lastNDays = this.orderModel?.lastNDays || null;
    this.orderModel.minPrice = this.orderModel?.minPrice || null;
    this.orderModel.maxPrice = this.orderModel?.maxPrice || null;
    this.orderModel.productFlag = 0;
    this.orderModel.racfId =this.userService.getRacfId();
    this.model.racfId = this.userService.getRacfId()
    this.isAdmin = this.userService.isAdmin();
    this.isSubRegionAdmin = this.userService.isSubRegionAdmin();
    this.dealerAdmin=this.userService.isDealer();
    let headerId = localStorage.getItem('currentheaderMenuId');
    // console.log(headerId);
    
    //this.headerMenu = headerId.split("-");
    if(headerId){
    // console.log("localstorage");
    }else{
      if(this.docOptions){
        this.model.documentCategoryId = this.docOptions[0].id;
      }
        this.intservice.model=this.model;
        this.intservice.changeMessage(this.model);
      
    }
     this.intservice.model=this.model;
    this.intservice.dealerViewTop(this.dealerView);
    this.orderService.changeMessage1(this.orderModel);
    let result = JSON.parse(localStorage.getItem('dealerView'));
    this.dealerView = result;
    this.pathArray = window.location.pathname.split('/');
    if(this.pathArray[2] == "dashboard"){
      //this.notEndUser = false;
      this.dealerView = false;
      let tokenValue = localStorage.getItem('token');
      if(tokenValue){
        var loadMenu = {"id": 1,"name": "Dashboard","isActive": true};
        this.newmenuChange(loadMenu);
      }
    }
    if(this.pathArray[2] == "printable-material" || this.pathArray[2] == "shopping-cart"){
      this.newcartChange();
      this.notEndUser = false;
    }
    if(this.pathArray[2] == "notification"){
      this.sideNotificationMenu();
      this.notEndUser = false;
    }
    if(this.pathArray[2] == "wish-list"){
      this.newwishlistChange();
      this.notEndUser = false;
    }
    if(this.pathArray[2] == "my-orders"){
      this.notEndUser = false;
    }
    if(this.pathArray[2] == "edit-template"){
      this.notEndUser = false;
      this.sideTemplateMenu();
    }
    if(this.pathArray[2] == "my-templates"){
      this.notEndUser = false;
      this.sideMyTemplateMenu();
    }
    if(this.pathArray[2] == "contact-us"){
      this.notEndUser = false;
      this.contactUSMenuChange();
    }
    // console.log(this.pathArray,'this.pathArray[2]')
    // if(this.pathArray[2] == "end-user-management"){
    //   console.log('273')
    // localStorage.removeItem('currentMenuId');
    // localStorage.removeItem('currentsideMenuId');
    // }
    // this.router.navigate(['/master/end-user-management']);
    //await this.enduserservice.getAll(null,null);
    //this.topmenuOptions.forEach(x => x.isActive =false);
    // ;
    //setTimeout(() => {this.newmenuChange(this.topmenuOptions[0]?.id);}, 200);
    //this.isActive = true;
    
    //if (this.userService?.userInfo?.racfId) {
      this.loadMenuAndUserInfo();
   // }
    // initialize push notification
    this.pushMessageService.initialize();

    // Handle service worker update
    this.update.available.subscribe((_) =>
      this.update.activateUpdate().then(() => {
        // todo revisit later
        document.location.reload();
      })
    );
    this.userToken = this.userService.getRacfId();
    if(this.userToken){
    this.initializeData().then(x => { });
    }
    this.subscribeStatusNotifications();
  }
  async initializeData() {
    this.topmenuOptions = await this.masterdataservice.gettopMenuDetail(true);
    this.docOptions = await this.docService.getMenuDocCategory(true);
    await this.rolepermission.getPermissionForModule(this.roleId,"Dashboard");
    await this.rolepermission.getPermissionForModule(this.roleId,"Dealer View");
    this.viewAccess = await this.rolepermission.getRoleViewAccess();
    this.dashBoardAccess =this.viewAccess.roleType;
  }
  routingPermission(){
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {

        // const user = localStorage.getItem("Id");
        // const Role = localStorage.getItem('UserRole')
        // if ((this.isDealer) && ( ev.url.includes('/dashboard')||ev.url.includes('/document-downloaded-report')||
        // ev.url.includes('/user-management') || ev.url.includes('/role-management') || ev.url.includes('/vendor-management')
        // || ev.url.includes('/banner-management') || ev.url.includes('/dealer-management') || ev.url.includes('/document-category') ||
        // ev.url.includes('/document-sub-category') || ev.url.includes('/document') || ev.url.includes('/user-activity') || 
        // ev.url.includes('/document-count-category')|| ev.url.includes('/order-list') 
        // || ev.url.includes('/dealer-report') || ev.url.includes('/dealer-order') || ev.url.includes('/document-uploaded-report')
        // ) ) {
        //   console.log('dealer')
        //     this.router.navigate(['master/end-user-management']);
        // }
        let urlNav:any[] = JSON.parse(localStorage.getItem('MenuOption'));
        let navURL:any[]=[];
        let dataURL:any;
        if(urlNav != null){
          for(let i=0;i<urlNav.length;i++){
            for(let j=0;j<urlNav[i].submenuList.length;j++){
                // console.log('ev.url',ev.url, urlNav[i].submenuList[j].subMenuUrl)
                // let staticURL = ['/master/notification','/master/shopping-cart','/master-wish-list','/master/my-orders']
                navURL.push(urlNav[i].submenuList[j].subMenuUrl);
                
            }
          }
        }
          
          navURL.push('/master/notification','/poc/file-upload','/master/pdf-view-full/','master/detailed-view/','/master/end-user-management','/master/shopping-cart','/master/wish-list','/master/my-orders','/master/contact-us','/master/feed-back')
          // console.log('how',navURL)

          dataURL= navURL.some((val)=> val == ev.url)
                // console.log('navURL',dataURL)
         if(urlNav){ 
                if(dataURL){
                    // console.log('true')
                }
                else if(dataURL == false){
                  if(this.isSubRegionAdmin){
                    if(ev.url.includes('/master/pdf-view-full/') || ev.url.includes('/master/detailed-view/')){
              
                    }
                    else{
                      this.router.navigate(['/master/dashboard']);
                    }
                  }
                  if(this.isVendor){
                    if(ev.url.includes('/master/pdf-view-full/') || ev.url.includes('/master/detailed-view/')){
              
                    }
                    else{
                      this.router.navigate(['master/end-user-management']);
                    }
                  }
                  if(this.isAdmin){
                    if(ev.url.includes('/master/pdf-view-full/') || ev.url.includes('/master/detailed-view/')){
              
                    }
                    else{
                      this.router.navigate(['/master/dashboard']);
                    }
                  }
                  if(this.isJdUser){
                    if(ev.url.includes('/master/pdf-view-full/') || ev.url.includes('/master/detailed-view/')){
              
                    }
                    else{
                      this.router.navigate(['master/end-user-management']);
                    }
                  }
                } 
            
          
        }
        else if((urlNav == null || urlNav == undefined) && dataURL == false){
          // console.log(dataURL)
          if (this.isDealer){
            if(ev.url.includes('/master/pdf-view-full/') || ev.url.includes('/master/detailed-view/')){
              
            }
            else{
              this.router.navigate(['master/end-user-management']);
            }
            
          }
          if(this.isVendor){
            if(ev.url.includes('/master/pdf-view-full') || ev.url.includes('/master/detailed-view')){
              
            }
            else{
              this.router.navigate(['master/end-user-management']);
            }
          }
          if(this.isJdUser){
            if(ev.url.includes('/master/pdf-view-full') || ev.url.includes('/master/detailed-view')){
              
            }
            else{
              this.router.navigate(['master/end-user-management']);
            }
          }
        }
    }
  });
  }
  async contactUSMenuChange(){
    
    await this.menuService.getLeftContactUsMenuItems().then((menus) => {
      this.menuItems = this.mapMenuToViewModel(menus);
    }).catch(err => {
      this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
    });
  }

  async mobmenuChange(activeMenu: any):Promise<void> {
    console.log('mobmenuChange')
    //console.log(activeMenu)
     this.mobmenuItems = await this.docService.getMenuDocCat1(activeMenu.id, true);
    //  console.log(this.mobmenuItems)
     //.log(this.menuItems);
    //if(this.dealerAdmin){
     localStorage.setItem('currentheaderMenuId',activeMenu.id+"-"+activeMenu.name); 
     localStorage.setItem('menu ID',activeMenu.id)
    //}
    this.model.documentCategoryId = activeMenu.id;
     this.model.documentCategoryName = activeMenu.name;
     this.model.documentSubCategoryName = null;
     this.model.documentSubChildCategoryName=null;
     this.model.documentSubCategoryId = null;
     this.hideSideBar = false;
     
     
    this.intservice.changeMessage(this.model);
    this.intservice.model=this.model;
    //if((!this.isAdmin && !this.isSubRegionAdmin) || this.notEndUser == false)
    this.router.navigate(['/master/end-user-management']);
     //activeMenu.isActive = !activeMenu.isActive;
     setTimeout(() => {this.hideSideBar = true;}, 200);
    
     if(!activeMenu.isActive)
    {
      this.resetActiveMenu(activeMenu);
      //activeMenu.onClick(activeMenu);
    }
    else{
      activeMenu.isActive = true
    }
    
    //activeMenu.onClick(activeMenu);
    if(this.mobmenuItems.length==0){
      document.getElementById("closeButton").click();
      }
  }

  async menuChange(activeMenu: any):Promise<void> {
    console.log('menuChange')
    //console.log(activeMenu)
     this.menuItems = await this.docService.getMenuDocCat1(activeMenu.id, true);
     //.log(this.menuItems);
    //if(this.dealerAdmin){
     localStorage.setItem('currentheaderMenuId',activeMenu.id+"-"+activeMenu.name);
     localStorage.setItem('menu ID',activeMenu.id) 
    //}
    localStorage.setItem('dealerView','true')
     localStorage.removeItem('currentMenuId');
     localStorage.removeItem('currentsideMenuId');

   
    this.model=this.model || {} as any;
    // console.log(this.model);
    // console.log(activeMenu);
    this.model.documentCategoryId = activeMenu.id;
     this.model.documentCategoryName = activeMenu.name;
     this.model.documentSubCategoryName = null;
     this.model.documentSubChildCategoryName=null;
     this.model.documentSubCategoryId = null;
      this.model.documentSubChildCategoryId = null;
      this.model.documentSubChildFourthCategoryId = null;
      this.model.documentSubChildFourthCategoryName = null;
     this.model.documentFileType = null;
     this.model.languageId = null;
     this.model.documentSortId = null;
     this.hideSideBar = false;
     
    
    this.intservice.changeMessage(this.model);
    this.intservice.model=this.model;
    //if((!this.isAdmin && !this.isSubRegionAdmin) || this.notEndUser == false)
    this.router.navigate(['/master/end-user-management']);
     //activeMenu.isActive = !activeMenu.isActive;
     setTimeout(() => {this.hideSideBar = true;}, 200);
    
     if(!activeMenu.isActive)
    {
      this.resetActiveMenu(activeMenu);
      //activeMenu.onClick(activeMenu);
    }
    else{
      activeMenu.isActive = true
    }
    
    //activeMenu.onClick(activeMenu);
  }

  async sideTypeMenuChange(activeMenu: any):Promise<void> {
    
    let data =  localStorage.getItem('currentsideMenuId')
    
    if(data != 'Contact Us'){
      this.model.documentFileType = activeMenu[0]?.documentTypeName;
      let result = JSON.parse(localStorage.getItem('fileType'))
    if(!result){
      localStorage.setItem('fileType',JSON.stringify(activeMenu));
      let result:any = localStorage.getItem('page');
      if(result != undefined){
        localStorage.removeItem('page');
      }
    }
    else if(result[0]?.documentTypeName != activeMenu[0]?.documentTypeName){
      localStorage.setItem('fileType',JSON.stringify(activeMenu));
      let result:any = localStorage.getItem('page');
      if(result != undefined){
        localStorage.removeItem('page');
      }
    }
   

  }
    this.intservice.changeMessage(this.model);
    this.intservice.model=this.model;
    if(this.dashBoardAccess != 'Dashboard View Access')
    this.router.navigate(['/master/end-user-management']);
    if(!activeMenu.isActive)
    {
      this.resetActiveMenu(activeMenu);
      if(this.dashBoardAccess == 'Dashboard View Access'){
        if (typeof activeMenu?.onClick !== "undefined") { 
          // safe to use the function
          activeMenu.onClick(activeMenu);
       }
     }
    }
    else{
      activeMenu.isActive = true
    }
 }

 async sideSortMenuChange(activeMenu: any):Promise<void> {
  this.model.documentSortId = activeMenu[0]?.sortId;
  let result:any = JSON.parse(localStorage.getItem('sortById'));
  console.log('result',activeMenu[0]?.sortId)
  if(!result){
    localStorage.setItem('sortById',JSON.stringify(activeMenu));
    let result:any = localStorage.getItem('page');
    console.log('pagesing',result)
    if(result != undefined){
      console.log('side bar')
      localStorage.removeItem('page');
    }
  }
  else if(result[0]?.sortId != activeMenu[0]?.sortId){
    let result:any = localStorage.getItem('page');
    if(result != undefined){
      localStorage.removeItem('page');
    }
    localStorage.setItem('sortById',JSON.stringify(activeMenu));

  }
  this.intservice.changeMessage(this.model);
  this.intservice.model=this.model;
  if(this.dashBoardAccess == 'Dashboard View Access')
  console.log('477')
  this.router.navigate(['/master/end-user-management']);
  if(!activeMenu.isActive)
  {
    this.resetActiveMenu(activeMenu);
    if(this.dashBoardAccess == 'Dashboard View Access'){
      if (typeof activeMenu?.onClick !== "undefined") { 
        // safe to use the function
        activeMenu.onClick(activeMenu);
     }
   }
  }
  else{
    activeMenu.isActive = true
  }
}

async sideLanguageMenuChange(activeMenu: any):Promise<void> {
  this.model.languageId  = activeMenu[0]?.id;
  let result = JSON.parse(localStorage.getItem('language'))
  if(!result){
    localStorage.setItem('language',JSON.stringify(activeMenu));
    let result:any = localStorage.getItem('page');
    if(result != undefined){
      localStorage.removeItem('page');
    }
  }
  else if(result[0]?.id != activeMenu[0]?.id){
    let result:any = localStorage.getItem('page');
    if(result != undefined){
      localStorage.removeItem('page');
    }
    localStorage.setItem('language',JSON.stringify(activeMenu));

  }
  this.intservice.changeMessage(this.model);
  this.intservice.model=this.model;
  if(this.dashBoardAccess != 'Dashboard View Access')
  this.router.navigate(['/master/end-user-management']);
  if(!activeMenu.isActive)
  {
    this.resetActiveMenu(activeMenu);
    if(this.dashBoardAccess == 'Dashboard View Access'){
      if (typeof activeMenu?.onClick !== "undefined") { 
        // safe to use the function
        activeMenu.onClick(activeMenu);
     }
   }
  }
  else{
    activeMenu.isActive = true
  }
}

  async sidemenuChange(activeMenu: any):Promise<void> {
    console.log('sidemenuChange',activeMenu);
    this.model.documentCategoryId =null;
    this.model.documentCategoryName =null;
    this.model.documentSubCategoryId = activeMenu?.id;
    this.model.documentSubCategoryName = activeMenu?.name;
    this.model.documentSubChildCategoryId = null;
    this.model.documentSubChildCategoryName = null;
    this.model.documentSubChildFourthCategoryId = null;
    this.model.documentSubChildFourthCategoryName = null;
    // this.model.documentSubChildCategoryId =activeMenu?.documentchildId;
    // this.model.documentSubChildCategoryName =activeMenu?.documentChildName;
    // this.model.documentSubChildFourthCategoryId =activeMenu?.idChildmenu;
    // this.model.documentSubChildFourthCategoryName =activeMenu?.nameChildmenu;

    // this.model.documentSubChildCategoryId =activeMenu?.documentchildId;
    // this.model.documentSubChildCategoryName =activeMenu?.documentChildName;
    // this.model.documentSubChildFourthCategoryId =activeMenu?.idChildmenu;
    // this.model.documentSubChildFourthCategoryName =activeMenu?.nameChildmenu;
    // parent[0]
    // this.topMenuItems.find()
    this.intservice.changeMessage(this.model);
    this.intservice.model=this.model;
    if(localStorage.getItem('currentMenuId')){
      this.dealerView = false;
    }
   if(this.dealerView || this.dashBoardAccess == 'Dealer View Access')
    {
      this.router.navigate(['/master/end-user-management']);
    if(!activeMenu.isActive)
    {
      this.resetActiveMenu(activeMenu);
      if(this.dashBoardAccess == 'Dashboard View Access'){
        if (typeof activeMenu?.onClick !== "undefined") { 
          // safe to use the function
          activeMenu.onClick(activeMenu);
       }
     }
    }
    else{
      activeMenu.isActive = true;
    }
  }
 }
  async sidemenuFourthChange(activeMenu: any):Promise<void> {
    console.log('actionchildFourthItemEmit',activeMenu);
    this.model.documentSubCategoryId = null;
    this.model.documentSubCategoryName = null;
    this.model.documentCategoryId = null;
    this.model.documentCategoryName = null;
    this.model.documentSubChildCategoryId = null;
    this.model.documentSubChildFourthCategoryId = null;
    this.model.documentSubChildFourthCategoryName = null;
    this.model.documentSubChildCategoryId =activeMenu?.documentchildId;
    this.model.documentSubChildCategoryName =activeMenu?.documentChildName;
    // parent[0]
    // this.topMenuItems.find()
    this.intservice.changeMessage(this.model);
    this.intservice.model=this.model;
    if(localStorage.getItem('currentMenuId')){
      this.dealerView = false;
    }
   if(this.dealerView || this.dashBoardAccess == 'Dealer View Access')
    {
      this.router.navigate(['/master/end-user-management']);
    if(!activeMenu.isActive)
    {
      this.resetActiveMenu(activeMenu);
      if(this.dashBoardAccess == 'Dashboard View Access'){
        if (typeof activeMenu?.onClick !== "undefined") { 
          // safe to use the function
          activeMenu.onClick(activeMenu);
       }
     }
    }
    else{
      activeMenu.isActive = true;
    }
  }
 }
  async sidemenuLastChange(activeMenu: any):Promise<void> {
    console.log('sidemenuLastChange',activeMenu);
    this.model.documentSubCategoryId = null;
    this.model.documentSubCategoryName = null;
    this.model.documentSubChildFourthCategoryId =activeMenu?.idChildmenu;
    this.model.documentSubChildFourthCategoryName =activeMenu?.nameChildmenu;
    // parent[0]
    // this.topMenuItems.find()
    this.intservice.changeMessage(this.model);
    this.intservice.model=this.model;
    if(localStorage.getItem('currentMenuId')){
      this.dealerView = false;
    }
   if(this.dealerView || this.dashBoardAccess == 'Dealer View Access')
    {
      this.router.navigate(['/master/end-user-management']);
    if(!activeMenu.isActive)
    {
      this.resetActiveMenu(activeMenu);
      if(this.dashBoardAccess == 'Dashboard View Access'){
        if (typeof activeMenu?.onClick !== "undefined") { 
          // safe to use the function
          activeMenu.onClick(activeMenu);
       }
     }
    }
    else{
      activeMenu.isActive = true;
    }
  }
 }

 orderFilterChange(val:any){
   
   this.orderModel.orderStatusList=val;
  this.orderService.changeMessage1(this.orderModel);
  //this.subMenuItem = await this.docService.getsubchildMenuItem(activeMenu.id, true);
 }

 orderTypeChange(val:any)
 {
   if(val !=null){
    var orderId =val[0].id;
   this.orderModel.productFlag = orderId;
   this.orderService.changeMessage1(this.orderModel);
   }
   else{
    this.orderModel.productFlag = null;
    this.orderService.changeMessage1(this.orderModel);
   }
 }

 orderRangeChange(val:any){
   //console.log(val);
  
   this.orderModel = val;
  //this.orderModel.orderStatus=val;
 this.orderService.changeMessage1(this.orderModel);
 //this.subMenuItem = await this.docService.getsubchildMenuItem(activeMenu.id, true);
}

 orderDayFilterChange(val:any){
  this.orderModel.lastNDays=val;
 this.orderService.changeMessage1(this.orderModel);
 //this.subMenuItem = await this.docService.getsubchildMenuItem(activeMenu.id, true);
}
  async dealerTopMenu(){
  //console.log("madhu");
  await this.menuService.getLeftDealerMenuItems().then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
    this.mobmenuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  });
  //.dealerView = true;
  //this.intservice.dealerViewTop(this.dealerView);
}
 async sidesubmenuChange(activeMenu: any):Promise<void> {
  // console.log(activeMenu); 
  this.model.documentCategoryId = null;
  this.model.documentCategoryName = null;
  this.model.documentSubChildCategoryId =activeMenu?.documentchildId;
  this.model.documentSubChildCategoryName =activeMenu?.documentChildName;
  this.intservice.changeMessage(this.model);
  this.intservice.model=this.model;
  this.subMenuItem = await this.docService.getsubchildMenuItem(activeMenu.id, true);
  this.subchildMenuFourthItem = await this.docService.getsubchildFourthMenu(activeMenu.id, true);
  this.router.navigate(['/master/end-user-management']);
  if(!activeMenu.isActive)
  {
    this.resetActiveMenu(activeMenu);
    if(this.dashBoardAccess == 'Dashboard View Access'){
      if (typeof activeMenu?.onClick !== "undefined") { 
        // safe to use the function
        activeMenu.onClick(activeMenu);
     }
   }
  }
  else{
    activeMenu.isActive = true
  }
}
 async sidesubmenuFourthChange(activeMenu: any):Promise<void> {
  console.log(activeMenu); 
  this.model.documentCategoryId = null;
  this.model.documentCategoryName = null;
  this.model.documentSubChildCategoryId =activeMenu?.documentchildId;
  this.model.documentSubChildCategoryName =activeMenu?.documentChildName;
  this.intservice.changeMessage(this.model);
  this.intservice.model=this.model;
  this.subMenuItem = await this.docService.getsubchildMenuItem(activeMenu.id, true);
  this.subchildMenuFourthItem = await this.docService.getsubchildFourthMenu(activeMenu.id, true);
  this.router.navigate(['/master/end-user-management']);
  if(!activeMenu.isActive)
  {
    this.resetActiveMenu(activeMenu);
    if(this.dashBoardAccess == 'Dashboard View Access'){
      if (typeof activeMenu?.onClick !== "undefined") { 
        // safe to use the function
        activeMenu.onClick(activeMenu);
     }
   }
  }
  else{
    activeMenu.isActive = true
  }
}



  async loadnewmenuChange(activeMenu: any):Promise<void> {
    // console.log(activeMenu)
    let currentMenuNewId:any = localStorage.getItem('currentMenuId');
    // if(currentMenuNewId){
    currentMenuNewId = currentMenuNewId.split("-");
    if((this.dashBoardAccess == 'Dashboard View Access') && (!this.dealerView)){
      if(currentMenuNewId[0]&& this.pathArray[2] != "order-list"){
        await this.menuService.getLeftNewMenuItems(Number(currentMenuNewId[0]), true).then((menus) => {
          this.menuItems = this.mapMenuToViewModel(menus);
          this.mobmenuItems = this.mapMenuToViewModel(menus);   
        }).catch(err => {
          this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
        });
      }else if(this.pathArray[2] != "order-list"){
        await this.menuService.getLeftNewMenuItems(activeMenu[0].id, true).then((menus) => {
          this.menuItems = this.mapMenuToViewModel(menus);
          this.mobmenuItems = this.mapMenuToViewModel(menus);   
        }).catch(err => {
          this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
        });
      }
    }
    // await this.menuService.getLeftNewMenuItems(activeMenu[0].id, true).then((menus) => {
    //   this.menuItems = this.mapMenuToViewModel(menus);  
    // }).catch(err => {
    //   this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
    // });
  // }
    
    this.setTopMenuItems();
  }
  async newsearchmenuChange(activeMenu: any):Promise<void>{
    localStorage.setItem('searchData',activeMenu)
    this.model.documentSearch =activeMenu;

    this.FilterBody = activeMenu;
    let id:any = '';
    // this.model.documentCategoryId = id;
    this.model.documentCategoryName = null;
    this.intservice.changeMessage(this.model);
    this.intservice.model=this.model;
    if(this.router.url != '/master/end-user-management'){
       this.router.navigate(['/master/end-user-management']);
    }
    // if(!this.isAdmin && !this.isSubRegionAdmin)
    // this.router.navigate(['/master/end-user-management']);
  }
//   async newmenuChange(activeMenu: any):Promise<void> {
//     console.log(activeMenu);
//     if(activeMenu.id+"-"+activeMenu.name != localStorage.getItem('currentMenuId')){
//       localStorage.removeItem('currentsideMenuId');
//     }
  
//     // localStorage.setItem('currentMenuId',activeMenu.id+"-"+activeMenu.name);
    
//     // this.menuItems = this.mapMenuToViewModel(activeMenu.subMenu);
//     // this.mobmenuItems = this.mapMenuToViewModelSub(activeMenu.subMenu);

//     // console.log(this.menuItems,this.mobmenuItems);
//     if(this.isAdmin || this.isSubRegionAdmin){
//       localStorage.setItem('currentMenuId',activeMenu.id+"-"+activeMenu.name);
//     }
//     console.log(activeMenu.subMenu);
//     this.menuItems = this.mapMenuToViewModel(activeMenu.subMenu);
//     this.mobmenuItems = this.mapMenuToViewModelSub(activeMenu.subMenu);
//     // await this.menuService.getLeftNewMenuItems(activeMenu.id, true).then((menus) => {
//     //   this.menuItems = this.mapMenuToViewModel(menus);
//     //   this.mobmenuItems = this.mapMenuToViewModel(menus);
//     // }).catch(err => {
//     //   this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
//     // });

//     this.setTopMenuItems();
//     //this.menuItems = await this.masterdataservice.getMenudetail(activeMenu.id, true);
//     this.hideSideBar = false;
//     activeMenu.isActive = !activeMenu.isActive;
//     setTimeout(() => {this.hideSideBar = true;}, 200);
   
//     if(!activeMenu.isActive)
//    {
//      this.resetActiveMenu(activeMenu);
//      //activeMenu.onClick(activeMenu);
//    }
//    else{
//      activeMenu.isActive = true
//    }
   
  
    
//    //activeMenu.onClick(activeMenu);
//  }
async newmenuChange(activeMenu: any):Promise<void> {
  if(activeMenu.id+"-"+activeMenu.name != localStorage.getItem('currentMenuId')){
    localStorage.removeItem('currentsideMenuId');
  }
console.log('currentMenuId',activeMenu.id+"-"+activeMenu.name)
  localStorage.setItem('currentMenuId',activeMenu.id+"-"+activeMenu.name);
  await this.menuService.getLeftNewMenuItems(activeMenu.id, true).then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
    this.mobmenuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  });

  this.setTopMenuItems();
  //this.menuItems = await this.masterdataservice.getMenudetail(activeMenu.id, true);
  this.hideSideBar = false;
  activeMenu.isActive = !activeMenu.isActive;
  setTimeout(() => {this.hideSideBar = true;}, 200);
 
  if(!activeMenu.isActive)
 {
   this.resetActiveMenu(activeMenu);
   //activeMenu.onClick(activeMenu);
 }
 else{
   activeMenu.isActive = true
 }
 

  
 //activeMenu.onClick(activeMenu);
}

 async newcartChange()
 {
  await this.menuService.getLeftcartMenuItems().then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  });

 }

 async sideTemplateMenu()
 {
  await this.menuService.getLeftTemplateMenuItems().then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
    //this.mobmenuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  });

 }

 async sideMyTemplateMenu()
 {
  await this.menuService.getLeftMyTemplateMenuItems().then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
    //this.mobmenuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  });

 }
 async sideNotificationMenu(){
  await this.menuService.getLeftNotificationMenuItems().then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  }); 
 }
 async sidemymenuChange(){
  await this.menuService.getLeftorderMenuItems().then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
    this.mobmenuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  }); 
 }
 async newwishlistChange(){
  await this.menuService.getLeftwishMenuItems().then((menus) => {
    this.menuItems = this.mapMenuToViewModel(menus);
    ///this.mobmenuItems = this.mapMenuToViewModel(menus);
  }).catch(err => {
    this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
  });
 }
   
  resetActiveMenu(activeMenu: NavbarMenuItem): void {
    console.log(activeMenu)
    const setActiveFalse = (menu: NavbarMenuItem) => {
      if (menu.children) {
        menu.children.forEach(x => setActiveFalse(x));
      }
    };
    this.menuItems.forEach(menuItem => setActiveFalse(menuItem));
    this.mobmenuItems.forEach(menuItem => setActiveFalse(menuItem));
    
    activeMenu.isActive = true;
    if (activeMenu.parent) {
      activeMenu.parent.isActive = true;
    }
    console.log(activeMenu);
  }
    

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  async loadMenuAndUserInfo() {
    try {
      this.loading = true;
      // const res = await menuItems.userService.getUserInfo(this.authService.getRacfId());
      // if (ApiErrorUtil.isError(res)) {
      //   this.alertService.show('Failed to get user info');
      //   return;
      // } else {
      //   this.userService.userInfo = {name: res.data.name, role: res.data.role, racfId: this.authService.getRacfId()};
      //   this.userService.userInfoChange.next(this.userService.userInfo);
      // }
      //await this.setSideMenuItems();
      if(this.pathArray[2] != "notification" && this.pathArray[2] != "contact-us"){
      this.loadnewmenuChange(this.topmenuOptions);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  private setUpModalService() {
    this.modalService.publisher.subscribe((params) => {
      this.modalParams = params;
      this.changeDetectRef.markForCheck();
    });
  }

  private setUpAlertService() {
    this.alertService.publisher.subscribe((params) => {
      this.alertParams = params;
      this.changeDetectRef.markForCheck();
    });
  }

  detectClientDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    this.deviceInfo = {
      ...this.deviceInfo,
      isMobile,
      isTablet,
      isDesktopDevice,
    };
    // Post to api
  }

  setTopMenuItems(): void {
    this.topMenuItems = [
      {
        label: '',
        name: 'home',
        menuType: 'icon',
        // children: this.sideMenuItems,
        onClick: (menu) => {
          // todo
        },
        isActive: true,
        svgIcon:
          '<svg focusable="false" aria-hidden="true" class="nav-home-icon" fill="#aaa" height="24" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>',
      },
      // {
      //   label: 'Settings',
      //   name: 'Settings',
      //   menuType: 'link',
      //   onClick: (menu) => {
      //     // this.router.navigate(['/admin/user-management']);
      //   },
      // },
      ...this.sideMenuItems
    ];
  }

  mapMenuToViewModel(menus: NavMenuModel[]): NavbarMenuItem[] {
    console.log(menus);
    if (!menus) { return []; }
    return menus.map<NavbarMenuItem>((menu, i) => {
      const children = menu.submenu && (menu.subMenuName.toLocaleLowerCase() == menu.submenu[0].subMenuName.toLocaleLowerCase() && menu.submenu.length == 1)  ? null : menu.submenu ? this.mapMenuToViewModel(menu.submenu) : null;
      const menuType = menu.submenu && menu.submenu.length && children != null ? 'dropdown' : 'link';
      return {
        id: menu.subMenuId,
        label: menu.subMenuName,
        name: menu.subMenuName,
        menuType,
        children,
        link:menu.subMenuUrl,
        onClick: (e) => {
         // if (children == null) {
            //const path = MenuUtil.getRouterPath(e.name);
            const path = menu.subMenuUrl;
            if (path) { this.router.navigate([path]); }
         // }
        }
      };
    });
  }
  mapMenuToViewModelSub(menus: NavMenuModel[]): NavbarMenuItem[] {
    // console.log(menus);
    if (!menus) { return []; }
    return menus.map<NavbarMenuItem>((menu, i) => {
      const children = menu.submenu && (menu.subMenuName.toLocaleLowerCase() == menu.submenu[0].subMenuName.toLocaleLowerCase() && menu.submenu.length == 1)  ? null : menu.submenu ? this.mapMenuToViewModel(menu.submenu) : null;
      const menuType = menu.submenu && menu.submenu.length && children != null ? 'dropdown' : 'link';
      return {
        label: menu.subMenuName,
        name: menu.subMenuName,
        menuType,
        children,
        link:menu.subMenuUrl,
        onClick: (e) => {
         // if (children == null) {
            //const path = MenuUtil.getRouterPath(e.name);
            const path = menu.subMenuUrl;
            if (path) { this.router.navigate([path]); }
         // }
        }
      };
    });
  }


  async setSideMenuItems() {
    await this.menuService.getLeftMenuItems().then((menus) => {
      this.menuItems = this.mapMenuToViewModel(menus);
      this.mobmenuItems =  this.mapMenuToViewModel(menus);
    }).catch(err => {
      this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
    });

    this.setTopMenuItems();
    // this.sideMenuItems = [
    //   {
    //     label: 'User Management',
    //     name: 'user-management',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/user-management']);
    //     },
    //   },
    //   {
    //     label: 'Reference Document',
    //     name: 'reference-document',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/reference-document']);
    //     },
    //   },
    //   {
    //     label: 'Vendor Profiles',
    //     name: 'vendor-profiles',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/vendor-management']);
    //     },
    //   },
    //   {
    //     label: 'Role Management',
    //     name: 'role-management',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/role-management']);
    //     },
    //   },
    //   {
    //     label: 'Location Master',
    //     name: 'locations-management',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/locations-management']);
    //     },
    //   },
    //   {
    //     label: 'VCMS Workflow',
    //     name: 'claims-workflow-management',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['admin/claims-workflow-management'])
    //     }
    //   },
    //   {
    //     label: 'Activity Master',
    //     name: 'activity-master',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/activity-master']);
    //     },
    //   },
    //   {
    //     label: 'Upload Status',
    //     name: 'upload-status',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/upload-status']);
    //     },
    //   },
    //   {
    //     label: 'Download Status',
    //     name: 'download-status',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/download-status']);
    //     },
    //   },
    //   {
    //     label: 'Claim Timeline Master',
    //     name: 'cliam-timeline-master',
    //     menuType: 'link',
    //     onClick: (menu) => {
    //       this.router.navigate(['/admin/cliam-timeline-master']);
    //     },
    //   },
    // ];
  }

  subscribeStatusNotifications() {
    // setInterval(async () => {
    //   try {
    //     const result = await this.notificationsService.getNotifications();
    //     if (!result || !result.data || !result.data.length) {
    //       return;
    //     }
    //     result.data.forEach(notification => {
    //       this.alertService.showWithOptions({
    //         alertType: notification.status === 'COMPLETED' ? AlertType.Success : AlertType.Critical,
    //         description: `${notification.notifType} ${notification.status === 'COMPLETED' ? 'Successfull' : 'Failed'}`,
    //         downloadText: notification.fileLink &&  'Click here to download file',
    //         downloadLink: notification.fileLink && this.notificationsService.fileDownloadUrl(notification.fileLink),
    //         downloadFileName: notification.fileLink
    //       });
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   this.okta.logout();
    //   }
    // }, 20000);
  }
}
