import { Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { EndUserModelMapper } from 'src/app/modules/adzone-admin/end-user-management/models/end-user-view.model';
import { EndUserService } from 'src/app/modules/adzone-admin/services/end-user.service';
import { AlertsService, AlertType } from '../../services/alerts.service';
import { CommonSyncService } from '../../services/common-sync.Service';
import { IndependentcomponentserviceService } from '../../services/independentcomponentservice.service';
import { NavMenuModel, NavMenuService } from '../../services/nav-menu.service';
import { ApiErrorUtil } from '../../utils/api-error.util';
import { CookieUtil } from '../../utils/cookie.util';
import { FilterSettings } from '../data-table/models/data-table-model';
import { NavbarMenuItem } from './models/navbar-menu-item.model';
import { MobileMenuFilterService } from '../../services/mobile-menu-filter.service'
import { RolePermissionService } from 'src/app/modules/adzone-admin/services/role-permission.service';
import { filter, pairwise } from 'rxjs/operators';
import { zIndex } from 'html2canvas/dist/types/css/property-descriptors/z-index';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer} from '@angular/platform-browser';
import { Console } from 'console';
RolePermissionService
@Component({
  selector: 'jd-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.scss']
})
export class NavbarTopComponent implements OnInit, OnChanges {

  //@Input() menuItems: NavbarMenuItem[];
  @Input('menuItems') menuItems: any = [];
  @Output() actionItemEmit = new EventEmitter<any>();
  @Output() actionsearchItemEmit = new EventEmitter<any>();
  @Output() actionCartEmit = new EventEmitter<any>();
  @Output() actionWishlistEmit = new EventEmitter<any>();
  @Output() actionDealerHeaderEmit = new EventEmitter<any>();
  @Output() actionDealerTopEmit = new EventEmitter<any>();
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('txtSearch') txtSearch: ElementRef;
  userName = '';
  roleName = '';
  dealerView = false;
  dealerEndView = false;
  topMenuItems: NavbarMenuItem[] = [];
  searchClicked = false;
  sideMenuItems: NavbarMenuItem[] = [];
  isAdmin = this.userService.isAdmin();
  RacfId: any;
  documentlist: any;
  productlist: any;
  wishlist: any
  cartCount: any;
  wishlistCount: any;
  showFilterIcon = false;
  isSubRegionAdmin = this.userService.isSubRegionAdmin();
  isVendor = this.userService.isVendor();
  isJdUser = this.userService.isJdUser();
  isDealer = this.userService.isDealer();
  isimpersonateuser = CookieUtil.getCookie('impersonateracfId');
  topmenuOptions: MasterDataModel[] = [];
  searchdocuments = false;
  documentlength: any[];
  productlength: any[];
  wishlistlength: any[];
  user = this.userService.getUserRoleId();
  permissionView: any;
  viewAccess: any;
  userToken: any;
  dashBoardAccess: any;
  allCart: any;
  topheaderMenu: any;
  currentMenu:any;
  searchTxt: string;
  showEditDoc = false;
  language:any;
  errMsg = false;
  displayStyle = "none";
  constructor(private userService: UserService,
    private syncservice: CommonSyncService,
    private alertService: AlertsService,
    public endservice: EndUserService,
    private router: Router, private masterserveice: MasterDataService,
    private menuService: NavMenuService,
    private intcompservice: IndependentcomponentserviceService,
    private filterMenuService: MobileMenuFilterService,
    private rolepermission: RolePermissionService,
    private modalService: ModalDialogService,
    public translate: TranslateService,
    private masterservice:MasterDataService,
    private common:CommonSyncService,
    private sanitizer: DomSanitizer

  ) { 
    this.common.currentMessage.subscribe(async message => {
      if(message == 'English'){
        this.language = 'English';
      }
      else if(message == 'Chinese'){
        this.language = 'Chinese';

      }
    })
    this.userToken = this.userService.getRacfId();
    // let language:any = this.masterservice.getLanguage(this.userToken);
    setTimeout(()=>{
      let languageData:any[]=[]  
      languageData = JSON.parse(localStorage.getItem('languageData'))

        if(languageData != null){
          let data = languageData.find((val:any)=> val.checked == true)
          let timeZoneReult = localStorage.getItem('timeZone')
          let applyReult = localStorage.getItem('Applylanguage')
          let languageSet = localStorage.getItem('preLanguage')
          let userLangCode = localStorage.getItem('userLangCode')
          let setFirstLang = localStorage.getItem('onetimeSet')
          console.log('userLangCode',userLangCode)

          if(setFirstLang != null){
            if(!applyReult){
              if(userLangCode != null){
                if(userLangCode == 'zh-cn'){
                  this.language = 'Chinese';
                  console.log('setfirts',this.language)
                  localStorage.setItem('preLanguage','zh-cn');
                  localStorage.setItem('onetimeSet','true');
                }
                else if(userLangCode == 'en-gb'){
                  this.language = 'English';
                  localStorage.setItem('preLanguage','en-gb')
                  localStorage.setItem('onetimeSet','true');
  
                }
                this.translate.use(userLangCode);
              }
            }
            else if(applyReult){
              console.log('applyReult')
        
              if(applyReult == 'zh-cn'){
                this.language = 'Chinese';
              }
              else if(applyReult == 'en-gb'){
                this.language = 'English';
              }
              this.translate.setDefaultLang(applyReult);
              this.translate.use(applyReult);
            }
            
            else if(!timeZoneReult){
              console.log('timezone',Intl.DateTimeFormat().resolvedOptions().timeZone)
              if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Calcutta'){
                // this.translate.setDefaultLang('en-gb');
             
                this.translate.use('en-gb');
                this.language = 'English';
                localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                let resultData = languageData.find((val:any)=>val.langCode == 'en-gb')
                this.masterservice.setLanguage(this.userToken,resultData.id);
                localStorage.setItem('preLanguage','en-gb');
                localStorage.removeItem('Applylanguage');
              }
              if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Shanghai'){
                this.translate.use('zh-cn');
                this.language = 'Chinese';
                localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                let resultData = languageData.find((val:any)=>val.langCode == 'zh-cn')
                this.masterservice.setLanguage(this.userToken,resultData.id);
                localStorage.setItem('preLanguage','zh-cn');
                localStorage.removeItem('Applylanguage');
              }
            }
            else if(timeZoneReult){
              if(timeZoneReult == 'Asia/Shanghai'){
                this.language = 'Chinese';
              }
              else if(timeZoneReult == 'Asia/Calcutta'){
                this.language = 'English';
              }
            }
          }
          else{
            if(!applyReult){
              if(userLangCode != null){
                if(userLangCode == 'zh-cn'){
                  console.log('user','chines')
                  this.language = 'Chinese';
                  console.log('uslanguageer','chines')
                  localStorage.setItem('preLanguage','zh-cn');
                  localStorage.setItem('onetimeSet','true');
                }
                else if(userLangCode == 'en-gb'){
                  console.log('user','English')
                  this.language = 'English';
                  localStorage.setItem('preLanguage','en-gb')
                  localStorage.setItem('onetimeSet','true');
                }
                // this.translate.setDefaultLang(userLangCode);
                this.translate.use(userLangCode);
              }
              else if(userLangCode === null){
                console.log('userLangCode')
  
                if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Calcutta'){
                  // this.translate.setDefaultLang('en-gb');
               console.log('tmezoneasai')
                  this.translate.use('en-gb');
                  this.language = 'English';
                  localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                  let resultData = languageData.find((val:any)=>val.langCode == 'en-gb')
                  localStorage.setItem('preLanguage','en-gb');
                  localStorage.setItem('userLangCode','en-gb');
                  localStorage.removeItem('Applylanguage');
                  this.masterservice.setLanguage(this.userToken,resultData?.id); 
                }
                if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Shanghai'){
                  this.translate.use('zh-cn');
                  this.language = 'Chinese';
                  localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                  let resultData = languageData.find((val:any)=>val.langCode == 'zh-cn')
                  localStorage.setItem('preLanguage','zh-cn');
                  localStorage.removeItem('Applylanguage');
                  localStorage.setItem('userLangCode','zh-cn');
                  this.masterservice.setLanguage(this.userToken,resultData?.id);
                }
              }
              else if(!userLangCode){
                console.log('userLangCode')
  
                if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Calcutta'){
                  // this.translate.setDefaultLang('en-gb');
               console.log('tmezoneasai')
                  this.translate.use('en-gb');
                  this.language = 'English';
                  localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                  let resultData = languageData.find((val:any)=>val.langCode == 'en-gb')
                  localStorage.setItem('preLanguage','en-gb');
                  localStorage.setItem('userLangCode','en-gb');
                  localStorage.removeItem('Applylanguage');
                  this.masterservice.setLanguage(this.userToken,resultData?.id); 
                }
                if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Shanghai'){
                  this.translate.use('zh-cn');
                  this.language = 'Chinese';
                  localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                  let resultData = languageData.find((val:any)=>val.langCode == 'zh-cn')
                  localStorage.setItem('preLanguage','zh-cn');
                  localStorage.removeItem('Applylanguage');
                  localStorage.setItem('userLangCode','zh-cn');
                  this.masterservice.setLanguage(this.userToken,resultData?.id);
                }
              }
            }
            else if(applyReult){
              console.log('applyReult')
        
              if(applyReult == 'zh-cn'){
                this.language = 'Chinese';
              }
              else if(applyReult == 'en-gb'){
                this.language = 'English';
              }
              this.translate.setDefaultLang(applyReult);
              this.translate.use(applyReult);
            }
            else if(languageSet){
              console.log('preferred')
        
              if(languageSet == 'zh-cn'){
                localStorage.removeItem('Applylanguage');
                this.language = 'Chinese';
              }
              else if(languageSet == 'en-gb'){
                localStorage.removeItem('Applylanguage');
                this.language = 'English';
              }
              this.translate.setDefaultLang(languageSet);
              this.translate.use(languageSet);
            }
            else if(!timeZoneReult){
              console.log('timezone')
              if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Calcutta'){
                // this.translate.setDefaultLang('en-gb');
             
                console.log('timezone','english')
                this.translate.use('en-gb');
                this.language = 'English';
                localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                let resultData = languageData.find((val:any)=>val.langCode == 'en-gb')
                console.log('resultData',resultData)
                this.masterservice.setLanguage(this.userToken,resultData.id);
                localStorage.setItem('preLanguage','en-gb');
                localStorage.removeItem('Applylanguage');
              }
              if(Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Shanghai'){
                console.log('timezone','chines')

                this.translate.use('zh-cn');
                this.language = 'Chinese';
                localStorage.setItem('timeZone',Intl.DateTimeFormat().resolvedOptions().timeZone)
                let resultData = languageData.find((val:any)=>val.langCode == 'zh-cn')
                console.log('resultData',resultData)
                this.masterservice.setLanguage(this.userToken,resultData.id);
                localStorage.setItem('preLanguage','zh-cn');
                localStorage.removeItem('Applylanguage');
              }
            }
            else if(timeZoneReult){
              if(timeZoneReult == 'Asia/Shanghai'){
                this.language = 'Chinese';
              }
              else if(timeZoneReult == 'Asia/Calcutta'){
                this.language = 'English';
              }
            }
          
          }
        }
    },500)
    
      
    
   
  }

  ngOnInit(): void {
    this.userName = this.userService.userInfo?.name;
    this.roleName = this.userService.userInfo?.role;

    this.resetParentRef();
    this.userToken = this.userService.getRacfId();
    if (this.userToken) {
      this.initializeData().then(x => { });
      this.checkPermission().then(x => {
      });
    }
    this.intcompservice.currentMessage.subscribe(async message => {
      console.log('dtaa',message)
      let data = localStorage.getItem('searchData');
      if(data != null && data != ''){
        this.searchTxt = data;
        this.searchClicked = true;
      }
      else{
        this.searchTxt = '';
        this.searchClicked = false;
        localStorage.removeItem('searchData')
      }
    })
   
    //this.intcompservice.currentMessagedealer.subscribe(async message => {
    //this.dealerView = message;
    //})


    this.showFilterIcon = false;
    this.endservice.downloadFilter = false;


    var pathArray = window.location.pathname.split('/');
    let result = JSON.parse(localStorage.getItem('dealerView'))
    if (pathArray[2] == "my-orders") {
      this.showFilterIcon = true;
      this.endservice.downloadFilter = true;
      this.endservice.userRole = false;

      this.dealerView = result;
    }
    if (pathArray[2] == "detailed-view") {
      this.showFilterIcon = false;
      this.endservice.downloadFilter = false;
      this.endservice.userRole = true;

      this.dealerView = result;
    }
    if (pathArray[2] == "end-user-management") {
      this.showFilterIcon = false;
      this.endservice.downloadFilter = false;
      this.endservice.userRole = true;
      this.dealerView = result;
    }
    if (pathArray[2] == "wish-list" || pathArray[2] == "shopping-cart" || pathArray[2] == "notification" || pathArray[2] == "contact-us" || pathArray[2] == "feed-back") {
      this.dealerView = result;
    }

  }
  async checkPermission() {
    await this.rolepermission.getPermissionForModule(this.user, "Dealer View");
    this.permissionView = await this.rolepermission.getRoleById("view_access");
    await this.rolepermission.getPermissionForModule(this.user, "Dashboard");
    await this.rolepermission.getPermissionForModule(this.user, "Dealer View");

    this.viewAccess = await this.rolepermission.getRoleViewAccess();
    this.dashBoardAccess = this.viewAccess.roleType;

  }
  async initializeData() {
    this.getCount();
  
    this.currentMenu=localStorage.getItem('currentMenuId');
    this.currentMenu = this.currentMenu.split("-");
  
if(this.currentMenu){
  this.topmenuOptions = await this.masterserveice.gettopMenuDetail(true);
    // this.topmenuOptions.forEach(x => x.isActive =false);
    console.log('topmenuOptions',this.topmenuOptions )
    this.topmenuOptions.forEach(function(x){
        console.log(x, x.subMenu);
      if(x.url == null && x.subMenu.length>0){
          x.url= x.subMenu[0].subMenuUrl;
      }

    })
    if(this.currentMenu[0] && this.currentMenu[1]){
      console.log('topmenu options')
      this.topmenuOptions.forEach(x => {
        if(x.id==this.currentMenu[0])
       { 
        x.isActive = true;
        console.log(x);
        var topBody = { "id": x.id, "name": x.name, "isActive": x.isActive,"subMenu":x.subMenu,"url": x.url }
        this.onMenuItemClick(topBody);
      }
      });
     
    }else{
      if(this.topmenuOptions.length > 0){
        this.topmenuOptions[0].isActive = true;
      }
    }
   
}

    
    //this.isActive = true;
    // console.log(this.topmenuOptions)

    // let topHeaderId = localStorage.getItem('currentMenuId');
    // if (topHeaderId) {
    //   this.topheaderMenu = topHeaderId.split("-");
    //   if (this.topheaderMenu[0] && this.topheaderMenu[1]) {
    //     console.log(this.topheaderMenu);
    //     var topBody ={"id":Number(this.topheaderMenu[0]),"name":this.topheaderMenu[1],"isActive":false} 
    //     this.onMenuItemClick(topBody);
       

    //   }
    // }

    // this.getCount();

  }
  async ngAfterViewChecked() {
    if (this.endservice?.CountChangeDetected) {
      try {
        this.getCount();
        this.endservice.CountChangeDetected = false;
      }
      catch (e) {

      }

    }
    if (this.rolepermission.checkDealview == false) {
      try {
        this.checkPermission();
        this.rolepermission.checkDealview = true;
      }
      catch (e) {

      }
    }

    if (this.rolepermission.checkMenuAccess == false) {
      try {
        this.checkPermission();
        this.topmenuOptions = await this.masterserveice.gettopMenuDetail(true);
        this.rolepermission.checkMenuAccess = true;
      }
      catch (e) {

      }
    }
  }
  async getCount() {
    this.RacfId = this.userService.getRacfId()
    this.allCart = await this.endservice.getWishCartCount(this.RacfId);
    this.documentlist = await this.endservice.getAllDocumentCart(this.RacfId,null);
    if (this.documentlist && this.documentlist.data && this.documentlist.data.content) {
      this.documentlength = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
    } else {
      this.documentlength = []
    }
    // this.allCart = await this.endservice.getWishCartCount(this.RacfId);
    // console.log(this.allCart);
    this.productlist = await this.endservice.getAllPrintableCart(this.RacfId);
    if (this.productlist && this.productlist.data && this.productlist.data.content) {
      this.productlength = await Promise.all(this.productlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
    } else {
      this.productlength = []
    }
    this.cartCount = this.allCart.data.cartCount;

    // this.wishlist = await this.endservice.getAllWishList(this.RacfId);
    // this.wishlistlength = await Promise.all(this.wishlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
    this.wishlistCount = this.allCart.data.wishlistCount;
    this.endservice.wishlistCount = this.wishlistCount;
    this.endservice.cartCount = this.cartCount;
  }
  async onaddcart() {
    this.actionCartEmit.emit();
    window.location.href = 'master/shopping-cart';
    // this.router.navigate(['master/shopping-cart'])

  }
  async onwishlist() {
    this.actionWishlistEmit.emit();
    window.location.href = 'master/wish-list';
    // this.router.navigate(['master/wish-list'])
  }

  getManual:any;
  pdfView:any;
  async userManualGuide(){
    let ISOCode = localStorage.getItem('CountryCode')
    if(ISOCode == "CN"){
      var value = 45;
    }else{
      var value = 43;
    }
    this.getManual = await this.endservice.getUserManualById(value);
    this.pdfView =  this.sanitizer.bypassSecurityTrustResourceUrl(this.getManual.data.fileUrl+"#toolbar=0&navpanes=0&scrollbar=0");
    this.errMsg = true;
    this.displayStyle = "block";
  }
  closeModal(){
    this.errMsg = false;
    this.displayStyle = "none";
  }
  homeMenuClick() {
    localStorage.removeItem('currentMenuId');
    localStorage.removeItem('currentsideMenuId');
    localStorage.removeItem('dealerView');
    localStorage.removeItem('currentheaderMenuId');
    localStorage.removeItem('page');
    localStorage.removeItem('sortById');
    localStorage.removeItem('fileType');
    localStorage.removeItem('language');
  }
  homeMenuClick1() {
    //localStorage.removeItem('dealerView');
    localStorage.removeItem('currentheaderMenuId');
    localStorage.removeItem('page');
    localStorage.removeItem('sortById');
    localStorage.removeItem('fileType');
    localStorage.removeItem('language');
  }
  async onMenuItemClick(activeMenu: any): Promise<void> {
    localStorage.removeItem('dealerView');
    await this.menuService.getLeftNewMenuItems(activeMenu.id, true).then((menus) => {
      this.menuItems = this.mapMenuToViewModel(menus);
    }).catch(err => {
      this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
    });
    this.setTopMenuItems();
    this.topmenuOptions.forEach(x => x.isActive =false);
    this.topmenuOptions.forEach(
      function(x){
        if(x.id == activeMenu.id){
        x.isActive = true;
        activeMenu = x;  
      }
        else
        x.isActive = false; 
      return x;
    });
    this.topmenuOptions.forEach(x => x.id ==activeMenu.id ? x.isActive =true : x.isActive =false);

    localStorage.setItem("userMenu", JSON.stringify(this.topmenuOptions));
    this.actionItemEmit.emit(activeMenu)
    activeMenu.isActive = !activeMenu.isActive;
    this.resetActiveMenu(activeMenu);
    if (!activeMenu.isActive) {
      this.resetActiveMenu(activeMenu);
      activeMenu.onClick(activeMenu);
    }
    else {
      activeMenu.isActive = false
    }
    //menu.onClick(menu);
  }

  onSearchClick(options: FilterSettings[]) {
    let result = localStorage.getItem('page');
    if(result != undefined){
      localStorage.removeItem('page');
    }
    this.actionsearchItemEmit.emit(options)
  }
  onSearchKeyup(options: any){
    console.log('optuions',options)
    if(options == ''){
      this.actionsearchItemEmit.emit(options)
    }

  }
  onClearSearch(val: string) {
    (this.txtSearch.nativeElement as HTMLInputElement).value = '';
    this.actionsearchItemEmit.emit("")
  }

  dealernewView(val: boolean) {
    this.dealerView = true;
    // localStorage.setItem('currentMenuId', "1")
    //this.actionDealerTopEmit.emit(val)
   let menuValue = localStorage.getItem('currentMenuId');
   let submenuValue = localStorage.getItem('currentsideMenuId');
   localStorage.setItem('menuValue',menuValue);
   localStorage.setItem('submenuValue',submenuValue);
    localStorage.removeItem('currentMenuId');
    localStorage.removeItem('currentsideMenuId');
    localStorage.removeItem('searchData');
    localStorage.setItem('dealerView', JSON.stringify(this.dealerView));
    //.intcompservice.dealerViewTop(this.dealerView);
    window.location.href = '/master/end-user-management'
    //this.router.navigate(['/master/end-user-management']);
    //this.actionDealerHeaderEmit.emit(val);


  }

  searchDocument() {
    this.searchdocuments = !this.searchdocuments;
  }
  resetActiveMenu(activeMenu: NavbarMenuItem): void {
    const setActiveFalse = (menu: NavbarMenuItem) => {
      menu.isActive = false;
      if (menu.children) {
        menu.children.forEach(x => setActiveFalse(x));
      }
    };
    this.menuItems.forEach(menuItem => setActiveFalse(menuItem));
    activeMenu.isActive = true;
    if (activeMenu.parent) {
      activeMenu.parent.isActive = true;
    }
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
    if (!menus) { return []; }
    return menus.map<NavbarMenuItem>((menu, i) => {
      // const menuType = menu.submenu && menu.submenu.length ? 'dropdown' : 'link';
      // const children = menu.submenu ? this.mapMenuToViewModel(menu.submenu) : null;
      const children = menu.submenu && (menu.subMenuName.toLocaleLowerCase() == menu.submenu[0].subMenuName.toLocaleLowerCase() && menu.submenu.length == 1) ? null : menu.submenu ? this.mapMenuToViewModel(menu.submenu) : null;
      const menuType = menu.submenu && menu.submenu.length && children != null ? 'dropdown' : 'link';

      return {
        label: menu.subMenuName,
        name: menu.subMenuName,
        menuType,
        children,
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
    }).catch(err => {
      this.alertService.show(ApiErrorUtil.errorMessage(err) || `Failed to load Menu`, AlertType.Critical);
    });

    //this.setTopMenuItems();
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuItems && changes.menuItems.previousValue) {
      this.resetParentRef();
    }
  }

  removeBackdrop() {
    document.getElementById("body").classList.remove("uxf-backdrop");
  }
  onCloseAddModal(e:any){
    console.log('choose langugae')
    this.showEditDoc = false;
  }
  resetParentRef() {
    if (!this.menuItems) { return; }
    const addParent = (menu: NavbarMenuItem, parent: NavbarMenuItem) => {
      menu.parent = parent;
      if (menu.children) {
        menu.children.forEach(x => addParent(x, menu));
      }
    };
    this.menuItems.forEach(menuItem => addParent(menuItem, null));
  }

  // onMenuItemClick(menu: NavbarMenuItem) {
  //   this.resetActiveMenu(menu);
  //   menu.onClick(menu);
  // }

  // resetActiveMenu(activeMenu: NavbarMenuItem): void {
  //   const setActiveFalse = (menu: NavbarMenuItem) => {
  //     menu.isActive = false;
  //     if (menu.children) {
  //       menu.children.forEach(x => setActiveFalse(x));
  //     }
  //   };
  //   this.menuItems.forEach(menuItem => setActiveFalse(menuItem));
  //   activeMenu.isActive = true;
  //   if (activeMenu.parent) {
  //     activeMenu.parent.isActive = true;
  //     document.getElementById("closeButton").click();
  //   }
  //   else
  //   document.getElementById("closeButton").click();
  // }

  // addBackdrop() {
  //   document.getElementById("body").classList.add("uxf-backdrop");
  // }

  async commonsync() {
    try {
      let result: ApiResponse<any>;
      result = await this.syncservice.getCommonSync();
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {

        this.alertService.show(result.message.messageDescription);
      }
    } catch (error) {
      this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to Sync ', AlertType.Critical);
    }


  }
  onimpersonateuser() {
    this.router.navigate(['impersonate']);
  }

  MyOrderfiltertop() {
    this.filterMenuService.sendClickEvent();
  }
  showPopup() {
    this.showEditDoc = true;
  }   
}
