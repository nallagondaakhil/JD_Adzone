import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SecurityContext, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';
import { CookieUtil } from 'src/app/shared/utils/cookie.util';
import { OktaService } from '../services/oktaauth.service';
import { UserService } from '../services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { DocumentTypeService } from 'src/app/modules/adzone-admin/services/doc-type.service';
import { NavbarMenuItem } from 'src/app/shared/components/navbar-top/models/navbar-menu-item.model';
import { EndUserPayLoad, MyOrderPayload } from 'src/app/modules/adzone-admin/models/end-user-master.model';
import { EndUserModelMapper, EndUserView } from 'src/app/modules/adzone-admin/end-user-management/models/end-user-view.model';
import { IndependentcomponentserviceService } from 'src/app/shared/services/independentcomponentservice.service';
import { EndUserService } from 'src/app/modules/adzone-admin/services/end-user.service';
import { OrdercomponentService } from 'src/app/shared/services/ordercomponent.service';
import { AdminNotificationService } from 'src/app/modules/adzone-admin/services/admin-notification.service';
import { FilterSettings } from 'src/app/shared/components/data-table/models/data-table-model';
import { RolePermissionService } from 'src/app/modules/adzone-admin/services/role-permission.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { CommonSyncService } from 'src/app/shared/services/common-sync.Service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  myOrdersPage = false;
  userName = '';
  roleName = '';
  isAuthenticated: boolean;
  dealerView = false;
  orderedlist:any;
  orderedLength:any[];
  orderCount:any;
  RacfId:any;
  headerMenu:any;
  searchClicked =false;
  searchActive=false;
  pathArray:any;
  showicon = false;
  close:boolean=true;
  notClose:boolean=false;
  homeisActive:boolean=false;
  viewAccess:any;
  dashBoardAccess:any;
  userToken:any;
  isAdmin = this.userService.isAdmin();
  isVendor = this.userService.isVendor();
  isJdUser = this.userService.isJdUser();
  isDealer = this.userService.isDealer();
  roleId = this.userService.getUserRoleId();
  isSubRegionAdmin = this.userService.isSubRegionAdmin();
  isimpersonateuser=CookieUtil.getCookie('impersonateracfId');
  @Input('menuItems') menuItems: any = [];
  @Input('mobmenuItems') mobmenuItems: any = [];
  @Input('subchildMenuItem') subchildMenuItem: any = [];
  @Input('subchildMenuFourthItem') subchildMenuFourthItem: any[] = [];

  @Input() model: EndUserPayLoad;
  @Input() orderModel: MyOrderPayload;
  @Output() actionTemplateEmit = new EventEmitter<any>();
  @Output() actionMyTemplateEmit = new EventEmitter<any>();
  @Output() actionItemEmit = new EventEmitter<any>();
  @Output() actionchildItemEmit = new EventEmitter<any>();
  @Output() actionsubchildItemEmit = new EventEmitter<any>();
  @Output() actionMyOrderEmit = new EventEmitter<any>();
  @Output() actionNotificationEmit = new EventEmitter<any>();
  @Output() actionsearchItemEmit = new EventEmitter<any>();
  @Output() actionmobItemEmit =new EventEmitter<any>();
  @Output() actionchildFourthItemEmit =new EventEmitter<any>();
  @Output() actionchildLastItemEmit =new EventEmitter<any>();
  @ViewChild('txtSearch') txtSearch: ElementRef;
  docOptions: MasterDataModel[] = [];
  docOptionsFor:boolean=false;
  docOptionsForsubData:boolean=false;
  category1Options: MasterDataModel[] = [];
  searchTxt:any;
  languageMobileView = false;
  apply:boolean = false;
  savepreference:boolean = false;
  languageData: any[]=[];
  fouthchildmenu:any;
  subChildMenu:any[]=[];
  preference: any;
  appliedLang: string;
  preferredLang: string;
  manualGuide:boolean = false;
  errMsg = false;
  displayStyle = "none";
  userManual:any;
  pdfView:any;
  langMang:boolean;
  userLangCode: string;
  constructor(private authService: AuthService, private router: Router, private userService: UserService,
    private okta:OktaService, private docService: DocumentTypeService,
    private intcompservice:IndependentcomponentserviceService,  public endservice: EndUserService,
    private orderService:OrdercomponentService,public notificationService : AdminNotificationService,
    private docservice:DocumentTypeService,private rolepermission:RolePermissionService,
    private http:HttpClient,
    private masterservice:MasterDataService,
    public translate: TranslateService,
    private common:CommonSyncService,
    private sanitizer: DomSanitizer) {
      // translate.addLangs(['en', 'nl']);
      // translate.setDefaultLang('en');
    
     }

  async ngOnInit(): Promise<void> {
    this.appliedLang = localStorage.getItem('Applylanguage');
    this.preferredLang = localStorage.getItem('preferred');
    this.userLangCode = localStorage.getItem('userLangCode');
    this.languageData = JSON.parse(localStorage.getItem('languageData'));
    console.log('this',this.appliedLang)
    if(this.appliedLang){
      if(this.appliedLang == 'en-gb'){
        this.langMang = true;
      }
      else if(this.appliedLang == 'zh-cn'){
        this.langMang = false;
      }
    }
    else if(this.preferredLang){
      console.log('changes')
      if(this.preferredLang == 'en-gb'){
        this.langMang = true;
      }
      else if(this.preferredLang == 'zh-cn'){
        this.langMang = false;
      }
    }
    else if(this.userLangCode){
      if(this.userLangCode == 'en-gb'){
        this.langMang = true;
      }
      else if(this.userLangCode == 'zh-cn'){
        this.langMang = false;
      }
    }
 
   
    this.userToken = this.userService.getRacfId();
    this.userName = this.userService.userInfo?.name;
    this.roleName = this.userService.userInfo?.role;
    this.model = this.model || {} as any;
    this.orderModel = this.orderModel || {} as any;
    this.model.documentCategoryId = this.model?.documentCategoryId || null; 
    // this.orderModel.orderStatus = this.orderModel?.orderStatus || null;
    // this.orderModel.lastNDays = this.orderModel?.lastNDays || null;
    this.orderModel.racfId =this.userService.getRacfId();
    // this.intcompservice.currentMessagedealer.subscribe(async message => {
    //   console.log(message);
    //   this.dealerView = message;
    // })
    var pathArray = window.location.pathname.split('/');
    let result = JSON.parse(localStorage.getItem('dealerView'))
    if(pathArray[2]=="end-user-management" || pathArray[2] == "shopping-cart" || pathArray[2] == "wish-list" || pathArray[2] == "detailed-view" || pathArray[2] == "my-orders" || pathArray[2] =="notification" || pathArray[2] =="contact-us" || pathArray[2] =="feed-back"){
      
    this.dealerView = result;
    }
    
    
    
   // this.getCount();
   this.userToken = this.userService.getRacfId();
   if(this.userToken){
    this.initializeData().then(x => { });
   }
    
    setInterval(async () => {
      try {
        if(this.userService?.userInfo?.racfId)
        {
          this.notificationService.getCount(null,null).subscribe(val=>{
            this.notificationService.miniNotificationCount=val.data.unreadCount;
      
          })
        }
       
       
      } catch (error) {
        this.okta.logout();

        //console.log(error);
      
      }
    }, 20000);
    //this.model.documentCategoryId = this.docOptions[0].id;
    //this.onMenuItemClick(this.docOptions[0]?.id);
   // this.actionItemEmit.emit(menu);
   this.intcompservice.currentMessage.subscribe(async message => {
    console.log('dtaa',message)
    let data = localStorage.getItem('searchData');
    if(data != null){
      message.documentCategoryName = null;
      message.documentSubCategoryId = null;
      message.documentSubCategoryName = null;
      message.documentSubChildCategoryId = null;
      message.documentSubChildCategoryName = null;
      message.documentSubChildFourthCategoryId = null;
      message.documentSubChildFourthCategoryName = null;
      message.documentSearch = data;
      this.searchTxt = data;
      this.searchClicked = true;
    }
    else{
      this.searchTxt = '';
      (this.txtSearch?.nativeElement as HTMLInputElement).value = '';
      this.searchClicked = false;
    }
  })
    
  }
  redirectToNotification(){
    localStorage.removeItem('page');
    localStorage.removeItem('sortById');
    localStorage.removeItem('language');
    localStorage.removeItem('fileType');
    localStorage.removeItem('currentheaderMenuId');
    this.actionNotificationEmit.emit();
    this.intcompservice.changeMessageNotification('pass')
    window.location.href = '/master/notification'
    // this.router.navigate(['/master/notification']);
  }
  // async getCount(){
  //   this.RacfId = this.userService.getRacfId()
  //   //this.orderService.currentMessage1.subscribe(async message1 => {
  //     this.orderedlist=await this.endservice.getAllMyOrder(this.orderModel);
  //     this.orderedLength = await Promise.all(this.orderedlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
  //   //})
  //   //this.orderedlist=await this.endservice.getAllMyOrder(this.RacfId);
  //   //this.orderedLength = await Promise.all(this.orderedlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
  //  this.orderCount = this.orderedLength.length;
  // }
  async initializeData() {
    await this.rolepermission.getPermissionForModule(this.roleId,"Dashboard");
    await this.rolepermission.getPermissionForModule(this.roleId,"Dealer View");
    this.viewAccess = await this.rolepermission.getRoleViewAccess();
    this.dashBoardAccess =this.viewAccess.roleType;
    this.docOptions = await this.docService.getMenuDocCategory(true);
    this.docOptions.forEach(x => x.isActive =false);
    this.docOptions[0].isActive = true;
    var onloadBody = {"id":this.docOptions[0].id,"name":this.docOptions[0].name,"isActive":false}
    this.model.documentCategoryId = this.docOptions[0].id;
    let headerId = localStorage.getItem('currentheaderMenuId');
    this.pathArray = window.location.pathname.split('/');
    if(this.pathArray[2] == "my-orders"){
      this.docOptions.forEach(x => x.isActive =false);
      this.myOrdersPage = true;
    }else{
      this.myOrdersPage = false;
    }
    if(this.pathArray[2] == "end-user-management"){
      this.showicon = true;
      this.homeisActive=true;
    if(headerId){
      this.headerMenu = headerId.split("-");
      if(this.headerMenu[0] && this.headerMenu[1]){
        var topBody ={"id":Number(this.headerMenu[0]),"name":this.headerMenu[1],"isActive":false} 
        this.onMenuItemClick(topBody);
        
      }
    }else if(this.dashBoardAccess == 'Dealer View Access' || this.dealerView)
    {
      this.onMenuItemClick(onloadBody);
    }
  }else{
    this.showicon = false;
  }
   
    //this.isActive = true;
  }

  mobonMenuItemClick(menu:any) {
    localStorage.setItem('dealerView','true')
    this.docOptionsFor=false;
    this.model.documentCategoryId = menu.id;
    //this.docOptions.forEach(x => x.isActive =false);
    this.docOptions.forEach(x => x.id ==menu.id ? x.isActive =true : x.isActive =false);
    this.actionmobItemEmit.emit(menu)
    menu.isActive = !menu.isActive;
    this.resetActiveMenu(menu);
    if(!menu.isActive)
    {
      this.resetActiveMenu(menu);
    //menu.onClick(menu);
    }
    else{
      menu.isActive = false
    }
    localStorage.removeItem('page');
    localStorage.removeItem('sortById');
    localStorage.removeItem('language');
    localStorage.removeItem('fileType');
    localStorage.removeItem('searchData');
        this.intcompservice.changeSearch(null)
    // localStorage.removeItem('searchData');
    //menu.onClick(menu);
  }
  onMenuItemClick(menu:any) {
    this.myOrdersPage = false;
    // localStorage.removeItem('searchData');
    this.model.documentCategoryId = menu.id;
    let result =  JSON.parse(localStorage.getItem('menu ID'))
    if(result){
      if(menu.id == result){
        // console.log('resukt',menu.id == result)
      }
      else{
        localStorage.removeItem('page');
        localStorage.removeItem('sortById');
        localStorage.removeItem('language');
        localStorage.removeItem('fileType');
        localStorage.removeItem('searchData');
        // localStorage.removeItem('userGuide');
        this.intcompservice.changeSearch(null)
        localStorage.setItem('menu ID',JSON.stringify(menu.id))
      }
    }
    else{
    localStorage.setItem('menu ID',JSON.stringify(menu.id))
    }

    //this.docOptions.forEach(x => x.isActive =false);
    this.docOptions.forEach(x => x.id ==menu.id ? x.isActive =true : x.isActive =false);
    this.actionItemEmit.emit(menu)
    menu.isActive = !menu.isActive;
    this.resetActiveMenu(menu);
    if(!menu.isActive)
    {
      this.resetActiveMenu(menu);
    //menu.onClick(menu);
    }
    else{
      menu.isActive = false
    }
    
    //menu.onClick(menu);
  }

  downloadsPage(){
    this.myOrdersPage = true;
    console.log('opoppnosajoi')
    localStorage.removeItem('page');
    localStorage.removeItem('sortById');
    localStorage.removeItem('language');
    localStorage.removeItem('fileType');
    localStorage.removeItem('searchData');

    this.docOptions.forEach(x => x.isActive =false);
    // this.router.navigate(['/master/my-orders']);
    window.location.href='/master/my-orders';
  
  }
  // helpGuide(){
  //   this.manualGuide = true;
  // }
  // backToMenu(){
  //   this.manualGuide = false;
  //   this.docOptionsFor=true;
  //   this.notClose=true;
  // }
  async userManualGuide(){
    let ISOCode = localStorage.getItem('CountryCode')
    if(ISOCode == "CN"){
      var value = 45;
    }else{
      var value = 43;
    }
    this.userManual = await this.endservice.getUserManualById(value);
    // this.pdfView = this.userManual.data.downloadUrl
    this.pdfView =  this.sanitizer.bypassSecurityTrustResourceUrl(this.userManual.data.fileUrl+"#toolbar=0&navpanes=0&scrollbar=0?embedded=true");
    console.log("pdf view",this.pdfView);
    // this.pdfView = this.sanitizer.sanitize(SecurityContext.URL,this.sanitizer.bypassSecurityTrustHtml(this.userManual.data.downloadUrl+"#toolbar=0&navpanes=0&scrollbar=0?embedded=true"));
    this.errMsg = true;
    this.displayStyle = "block";
    // this.getIframeYouTubeUrl();
  }
  zoom: number = 1.0;
  originalSize: boolean = true;

  incrementZoom(amount: number) {
    this.zoom += amount;
  }
//   getIframeYouTubeUrl(): SafeResourceUrl{
//     return this.sanitizer.bypassSecurityTrustResourceUrl(
//       this.userManual.data?.downloadUrl+"#toolbar=0&navpanes=0&scrollbar=0");
// }
  closeModal(){
    this.errMsg = false;
    this.displayStyle = "none";
  }
  async onsubMenuItemClick(menu:any) {
    console.log(menu)
    if(menu){
      localStorage.setItem('currentsideMenuId',menu.name);
      localStorage.setItem('currentsideSubMenuId',JSON.stringify(menu));
    }
  
    this.subchildMenuItem = await this.docservice.getsubchildMenuItem(menu.id, true);
    // console.log(this.subchildMenuItem);
    // this.docOptionsForsubData = true;
    if(this.subchildMenuItem.length == 0){
      this.close = true;
    }
    this.subchildMenuItem.forEach(x => x.isActive =false);
    menu.isActive = !menu.isActive;
    if(!menu.isActive)
    {
      this.actionchildItemEmit.emit(menu)
      this.resetActiveMenu(menu);
      if (typeof menu?.onClick !== "undefined") { 
        // safe to use the function
        menu.onClick(menu);
     }
    }
    else{
      this.actionchildItemEmit.emit(menu)
      menu.isActive = false
    }

    if(this.subchildMenuItem.length==0){
    document.getElementById("closeButton").click();
    }
  }
  async backNavsubChildFun(menu){
    this.subchildMenuItem = await this.docservice.getsubchildMenuItem(menu, true);
    // console.log(this.subchildMenuItem);
    this.docOptionsForsubData = true;
    if(this.subchildMenuItem.length == 0){
      this.close = true;
    }
    this.subchildMenuItem.forEach(x => x.isActive =false);
    menu.isActive = !menu.isActive;
    if(!menu.isActive)
    {
      this.actionchildItemEmit.emit(menu)
      this.resetActiveMenu(menu);
      if (typeof menu?.onClick !== "undefined") { 
        // safe to use the function
        menu.onClick(menu);
     }
    }
    else{
      this.actionchildItemEmit.emit(menu)
      menu.isActive = false
    }

    if(this.subchildMenuItem.length==0){
    document.getElementById("closeButton").click();
    }
  }
  async onsubMenuItemClick2(menu: any) {
    this.subchildMenuFourthItem.forEach((x:any) => {
      if(menu.idChildmenu == x.idChildmenu){
        x.isActive = true;
        this.actionchildLastItemEmit.emit(menu)
      }
      else{
        x.isActive = false
      }
    });
    this.close = true;
    document.getElementById("body").classList.remove("uxf-backdrop");
  }
  async onsubchildMenuItemClick(menu:any) {
    // console.log(menu);
    // this.subchildMenuItem.forEach(x => x.isActive =false);
    // menu.isActive = !menu.isActive;
    // if(!menu.isActive)
    // {
    //   this.actionsubchildItemEmit.emit(menu)
    //   this.resetActiveMenu(menu);
    //   if (typeof menu?.onClick !== "undefined") { 
    //     // safe to use the function
    //     menu.onClick(menu);
    //  }
    // }
    // else{
    //   this.actionsubchildItemEmit.emit(menu)
    //   menu.isActive = false
    // }
    this.subchildMenuFourthItem = await this.docservice.getsubchildFourthMenu(menu.documentchildId, true);

      this.fouthchildmenu = Array.from(Object.values(this.subchildMenuFourthItem))
      console.log('fourth',this.fouthchildmenu.length)
      if(this.fouthchildmenu.length == 0){
        this.close = true;
      }
      const addParent = (menu: NavbarMenuItem, parent: NavbarMenuItem) => {
        menu.parent = parent;
        if (menu.children) {
          menu.children.forEach(x => addParent(x, menu));
        }
      };
      let childData = this.subChildMenu.find((val:any)=> val.documentchildId == menu.documentchildId)
    
      this.subChildMenu.forEach((x:any)=> {
        if(childData.documentchildId != x.documentchildId){
          x.isActive = false

        }
      });
      this.subchildMenuFourthItem.forEach(menuItem => addParent(menuItem, null));
      this.fouthchildmenu.forEach(x => x.isActive = false);
      menu.isActive = !menu.isActive;
      if (!menu.isActive) {
        this.actionchildFourthItemEmit.emit(menu)
        this.resetActiveMenu(menu);
        if (typeof menu?.onClick !== "undefined") { 
          menu.onClick(menu);
       }
      }
      else {
        this.actionchildFourthItemEmit.emit(menu)
        menu.isActive = true
      }
    this.mobmenuItems = null;
    this.subchildMenuItem = null;
    document.getElementById("body").classList.remove("uxf-backdrop");
  
  }

  resetActiveMenu(activeMenu: NavbarMenuItem): void {
    const setActiveFalse = (menu: NavbarMenuItem) => {
      menu.isActive = false;
      if (menu.children) {
        menu.children.forEach(x => setActiveFalse(x));
      }
    };
    //this.menuItems.forEach(menuItem => setActiveFalse(menuItem));
    //activeMenu.isActive = true;
    if (activeMenu.parent) {
      activeMenu.parent.isActive = true;
      document.getElementById("closeButton").click();
    }
    //document.getElementById("closeButton").click();
  }
  onTemplates(){
    this.actionTemplateEmit.emit();
  }
  myTemplates(){
    this.actionMyTemplateEmit.emit();
  }

  homeMenuClick()
    {
      localStorage.removeItem('dealerView');
      localStorage.removeItem('currentheaderMenuId');
      localStorage.removeItem('currentMenuId');
      localStorage.removeItem('currentsideMenuId');
      localStorage.removeItem('menu ID');
    }
  
  onLogout() { 
    var RacfId = this.userService.getRacfId();
    var userId = this.userService.getUserId();
    this.authService.dealerLogout(RacfId,userId);
    localStorage.removeItem('currentheaderMenuId');
    localStorage.removeItem('currentMenuId');
    localStorage.removeItem('token');
    localStorage.removeItem('language');
    localStorage.removeItem('preLanguage');
    localStorage.removeItem('Applylanguage');
    localStorage.removeItem('lang');
    localStorage.removeItem('timeZone');
    localStorage.removeItem('preferred');
    localStorage.removeItem('userLangCode');
    localStorage.removeItem('languageData');
    localStorage.removeItem('onetimeSet');
    localStorage.removeItem('searchData');
    localStorage.removeItem('userGuide');
    localStorage.removeItem('CountryCode');
    this.okta.removeToken();
    this.okta.removeRefreshToken();
    this.okta.removeAccessToken();
    this.okta.removetokenExpiry();
    this.okta.removeRacfId();
    this.authService.removeImpersonateToken();
    
    this.okta.$isAuthenticated.subscribe(val => this.isAuthenticated = val);
    this.okta.logout(); 
    this.router.navigate(['login']);
  }

  onimpersonateLogout() {
    this.authService.removeImpersonateToken();
    window.location.reload();
    //this.router.onSameUrlNavigation ='reload';
    //this.router.navigate(['/']);
  }

  onimpersonateuser(){
   //this.isimpersonateuser = true;
    this.router.navigate(['impersonate']);
  }

  addBackdrop() {
    this.showicon = true;
    document.getElementById("body").classList.add("uxf-backdrop");
    this.manualGuide = false;
    this.docOptionsFor=true;
    this.close=false;
  }

  removeBackdrop() {
    if(this.notClose){
        this.notClose=false;
        return;
    }
    //$('#siteTopnav').hide();
    this.mobmenuItems = null;
    this.subchildMenuItem = null;
    document.getElementById("body").classList.remove("uxf-backdrop");
    this.close=true;
  }
  backNavigation(){
    // this.docOptionsFor=true;
    this.mobmenuItems = '';
    this.showicon = true;
    document.getElementById("body").classList.add("uxf-backdrop");
    this.docOptionsFor=true;
    this.notClose=true;
    // console.log(this.docOptionsFor)
    //this.router.navigate(['/master/end-user-management']);

  }
  backNavigation1(){
    this.subchildMenuItem = '';
    this.notClose=true;
    //this.router.navigate(['/master/end-user-management']);
  }
  backNavigation2(){
    console.log('back2')
    this.fouthchildmenu = '';
    this.showicon = true;
    this.docOptionsFor=true;
    this.notClose=true;

    // document.getElementById("body").classList.remove("uxf-backdrop");
  }
  async onMyOrder()
  {
    this.actionMyOrderEmit.emit();
  }
  onSearchClick(options:FilterSettings[]) {
    this.actionsearchItemEmit.emit(options)
  }

  onClearSearch(val: string) {
    (this.txtSearch.nativeElement as HTMLInputElement).value = '';
    this.actionsearchItemEmit.emit("")
  }
  homeIconClick(){
    localStorage.removeItem('currentheaderMenuId');
    localStorage.removeItem('dealerView');
  }
  filterOptionVisible(){
    this.common.changeMessage1('header',true);
    this.docOptionsFor=false;
    this.common.currentMessage1.subscribe((data:any)=>{
      console.log('dtafajbxk',data)
      if(data == 'navbarside'){
        this.languageMobileView=false;
        // this.filterMobileView=!this.filterMobileView;
      }
      else{
        this.languageMobileView=true;
      }
     })
    // this.languageMobileView=!this.languageMobileView;
    // this.userToken = this.userService.getRacfId();
//     let language:any = this.masterservice.getLanguage(this.userToken);
//   setTimeout(()=>{                        
//     this.languageData = language.__zone_symbol__value;
//     console.log('laguga',this.languageData)
// }, 800);
  }
 
  onClearAll(){
    this.languageMobileView = false
  }
onCloseApply(e:any){
  this.apply = false;
  this.savepreference = false;
  this.onClearAll();
}
onCloseSave(e:any){
  this.apply = false;
  this.savepreference = false;
  this.onClearAll();

}

onApply(){
  this.apply = true;
  this.savepreference = false;
  if(this.preference == 3){
    localStorage.setItem('Applylanguage','zh-cn');
    localStorage.setItem('userLangCode','zh-cn');
    this.translate.use('zh-cn');
    localStorage.removeItem('preLanguage');
    this.common.changeMessage('Chinese')
    this.ngOnInit();
    // this.masterservice.setLanguage(this.userToken,this.preference);
  
  }
  else if(this.preference == 2){
    console.log('lang')
    this.translate.use('en-gb');
    localStorage.setItem('Applylanguage','en-gb');
    localStorage.setItem('userLangCode','en-gb');
    localStorage.removeItem('preLanguage');
    this.common.changeMessage('English')
    this.ngOnInit();
    // this.masterservice.setLanguage(this.userToken,this.preference);
   
  }

}
onsave(){
  this.apply = false;
  this.savepreference = true;
  if(this.preference == 3){
    this.translate.use('zh-cn');
    this.masterservice.setLanguage(this.userToken,this.preference);
    localStorage.setItem('preLanguage','zh-cn');
    localStorage.setItem('userLangCode','zh-cn');
    localStorage.setItem('preferred','zh-cn');
    localStorage.removeItem('Applylanguage');
    setTimeout(()=>{
      this.userToken = this.userService.getRacfId();
      this.masterservice.getLanguage(this.userToken);
      console.log('this.language')
      this.common.changeMessage('Chinese')
      this.ngOnInit();
    },500)
  }
  else if(this.preference == 2){
    this.translate.use('en-gb');
    this.masterservice.setLanguage(this.userToken,this.preference);
    localStorage.setItem('preLanguage','en-gb');
    localStorage.setItem('userLangCode','en-gb');
    localStorage.setItem('preferred','en-gb');
    localStorage.removeItem('Applylanguage');
    setTimeout(()=>{
      this.userToken = this.userService.getRacfId();
      this.masterservice.getLanguage(this.userToken);
      console.log('this.language')
      this.common.changeMessage('English')
      this.ngOnInit();
    },500)
  }
  
}
changePreference(preference:any){
  console.log('preference',preference);
  this.preference = preference.languageId;
}
}
