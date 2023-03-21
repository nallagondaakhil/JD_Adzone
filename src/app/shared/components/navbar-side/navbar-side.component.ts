import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnChanges, OnInit, SimpleChanges,EventEmitter,ChangeDetectorRef,Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OktaService } from 'src/app/core/services/oktaauth.service';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { EndUserPayLoad, MyOrderPayload } from 'src/app/modules/adzone-admin/models/end-user-master.model';
import { DocumentTypeService } from 'src/app/modules/adzone-admin/services/doc-type.service';
import { NavMenuService } from '../../services/nav-menu.service';
import { NavbarMenuItem } from '../navbar-top/models/navbar-menu-item.model';
import { MobileMenuFilterService } from '../../services/mobile-menu-filter.service'
import { EndUserService } from 'src/app/modules/adzone-admin/services/end-user.service';
import { RolePermissionService } from 'src/app/modules/adzone-admin/services/role-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonSyncService } from '../../services/common-sync.Service';
import { IndependentcomponentserviceService } from '../../services/independentcomponentservice.service';

@Component({
  selector: 'jd-navbar-side',
  templateUrl: './navbar-side.component.html',
  styleUrls: ['./navbar-side.component.scss']
})
export class NavbarSideComponent implements OnInit, OnChanges {

  //@Input() menuItems: NavbarMenuItem[];
  @Input('menuItems') menuItems: any[] = [];
  @Input('subchildMenuItem') subchildMenuItem: any[] = [];
  @Input('subchildMenuFourthItem') subchildMenuFourthItem: any[] = [];
  @Input('listModel') listModel: any = [];
  @Output() actionchildFourthItemEmit =new EventEmitter<any>();
  @Output() actionchildLastItemEmit =new EventEmitter<any>();
  clickEventSubscription : Subscription;
  minValue: number = 0;
  maxValue: number = 100000;
  fouthchildmenu:any[]=[];
  subChildMenu:any[]=[];
  options: Options = {
    floor: 0,
    ceil: 10000
  };

  sortOptions = [
    {sortName: 'Newest To Oldest', sortId: 1},
    {sortName: 'Oldest To Newest', sortId: 2},
    {sortName: 'A to Z', sortId: 3},
    {sortName: 'Z to A', sortId: 4},
    
  ]
  sortOptionsLang = [
    {sortName: '从最新到最旧', sortId: 1},
    {sortName: '从最旧到最新', sortId: 2},
    {sortName: '从头到尾', sortId: 3},
    {sortName: 'Z到A', sortId: 4},
    
  ]
  documentOptions = [
    {name: 'Downloaded', id: 0},
    {name: 'Ordered', id: 1},
  ]
  showMenuFilter = false;
  showOrderFilter = false;
  filterMobileView = false;
  sortbyMobileView =false;
  myOrderMobileFilter =false;
  showicon = false;
  category1Options: MasterDataModel[];
  documentfileoptions:any[];
  languageoptions:any[];
  checkedArray:Array<any> = [];
  checkedOrderArray:Array<any> = [];
  changeMenu :Subscription;
  currRACFID: string;
  isAdmin:boolean;
  isSubRegionAdmin:boolean;
  dealerView = false;
  currentMenu:any;
  orderStatusDropdown=false;
  orderTimeDropdown=false;
  orderTypeDropdown=false;
  sortByDropdown=false;
  statusOrderContainer=false;
  orderTimeContainer=false;
  orderTypeContainer=false;
  sortByContainer=false;
  orderStatusHead=false;
  orderTimeHead=false;
  orderTypeHead=false;
  sortByHead=false;
  viewAccess:any;
  dashBoardAccess:any;
  user:any;
  userToken:any;
  MobilecheckedArray:Array<any>=[];
  allMenu : any;
  lang:boolean = true;
  @Input() model: EndUserPayLoad;
  @Input() orderModel: MyOrderPayload;
  @Output() actionItemEmit = new EventEmitter<any>();
  @Output() actionSortItemEmit = new EventEmitter<any>();
  @Output() actionTypeItemEmit = new EventEmitter<any>();
  @Output() actionchildItemEmit = new EventEmitter<any>();
  @Output() actionFourthchildItemEmit = new EventEmitter<any>();
  @Output() actionOrderEmit = new EventEmitter<any>();
  @Output() actionOrderdaysEmit = new EventEmitter<any>();
  @Output() actionOrderRangeEmit = new EventEmitter<any>();
  @Output() actionLanguageItemEmit = new EventEmitter<any>();
  
  @Output() actionProductEmit = new EventEmitter<any>();
  dealerViewEnable: any;
  filterData:boolean = true;
  pathArray: string[];
  appliedLang: string;
  preferredLang: string;
  userLangCode: string;
  langMang: boolean;
  constructor(
    private docservice: DocumentTypeService, private userService: UserService,private menuService:NavMenuService,
    private oktaService: OktaService,private masterservice:MasterDataService,
    private filterMenuService: MobileMenuFilterService,public endservice:EndUserService,
    private rolepermission:RolePermissionService,
    public translate:TranslateService,
    private intcompservice: IndependentcomponentserviceService,
    private common:CommonSyncService) {
      this.clickEventSubscription =this.filterMenuService.getClickEvent().subscribe(()=>{
        this.MyOrderfilter();
      });
      this.appliedLang = localStorage.getItem('Applylanguage');
      this.preferredLang = localStorage.getItem('preferred');
      this.userLangCode = localStorage.getItem('userLangCode');
    
      if(this.appliedLang){
        if(this.appliedLang == 'en-gb'){
          this.lang = true;
        }
        else if(this.appliedLang == 'zh-cn'){
          this.lang = false;
        }
      }
      else if(this.preferredLang){
        if(this.preferredLang == 'en-gb'){
          this.lang = true;
        }
        else if(this.preferredLang == 'zh-cn'){
          this.lang = false;
        }
      }
      else  if(this.userLangCode){
        if(this.userLangCode == 'en-gb'){
          this.lang = true;
        }
        else if(this.userLangCode == 'zh-cn'){
          this.lang = false;
        }
      }
      this.common.currentMessage.subscribe(async message => {
        this.onLanguage();
        if(message == 'English'){
          this.lang = true;
        }
        else if(message == 'Chinese'){
        this.lang = false;
  
        }
      })
     }

  async ngOnInit() {
    // this.intcompservice.currentMessageNotification.subscribe(async message => {
    //   console.log('messgae',message);
   
    //   if(message == 'pass'){
    //     this.filterData = false;
    //   }
    // })
  
    this.pathArray = window.location.pathname.split('/');
    if(this.pathArray[2] == "end-user-management"){
      this.filterData = true;
    }
    if(this.pathArray[2] == "contact-us"){
      console.log('conatct-su')
      this.filterData = false;
      this.showOrderFilter=false;

    }
    if(this.pathArray[2] == "feed-back"){
      this.filterData = false;
      this.showOrderFilter=false;

    }
    if(this.pathArray[2] == "wish-list"){
      console.log('this.pathArray[2]',this.pathArray[2])
      this.showOrderFilter=false;
    }
    if(this.pathArray[2] == "shopping-cart"){
      this.showOrderFilter=false;
    }
    this.dealerViewEnable = localStorage.getItem('dealerView')
    this.currRACFID = this.userService.getRacfId()
   
    this.resetParentRef();
    this.model = this.model || {} as any;
    this.orderModel = this.orderModel || {} as any;
    this.orderModel.orderStatusList = this.orderModel?.orderStatusList || null;
    this.orderModel.lastNDays = this.orderModel?.lastNDays || null;
    this.orderModel.productFlag = this.orderModel?.productFlag || null;
    this.orderModel.racfId =this.userService.getRacfId();
    this.isAdmin = this.userService.isAdmin();
    this.user = this.userService.getUserRoleId();
    this.isSubRegionAdmin = this.userService.isSubRegionAdmin();
    let result = JSON.parse(localStorage.getItem('dealerView'))
    this.dealerView = result;
    this.model.documentSubCategoryId = this.model?.documentSubCategoryId || null;
    this.model.documentCategoryId = this.model?.documentCategoryId || null;
    this.model.languageId = this.model?.languageId || null;
    this.endservice.showFilter=true;
    this.endservice.showAllFilter=true;
    this.endservice.menuFilter=true;

    var pathArray = window.location.pathname.split('/');
    if(pathArray[2] == "end-user-management"){
      this.showMenuFilter = true;
      this.showicon=true;
      this.showOrderFilter=false;
      this.endservice.downloadFilter=false;
    }
    if(pathArray[2] == "printable-material" || pathArray[2] == "shopping-cart" || pathArray[2]=="wish-list"){
      //this.showMenuFilter = false;
      this.showicon=false;
    }
    if(pathArray[2] == "my-orders"){
      this.showOrderFilter = true;
    }
    if(pathArray[2] == "detailed-view"){
      this.showOrderFilter = false;
    }
    this.initializeData().then(x => { });
  }
  async initializeData() {
    this.userToken = this.userService.getRacfId();
    if(this.userToken){
    this.documentfileoptions = await this.masterservice.getfilterDocumentFileType();
    let result:any = JSON.parse(localStorage.getItem('languageData'));
    this.languageoptions = result.map((x: any) => ({id: x.languageId, name: x.languageName}));
    if(!result){
      this.languageoptions = await this.masterservice.getfilterLanguageType();

    }

    await this.rolepermission.getPermissionForModule(this.user,"Dashboard");
    await this.rolepermission.getPermissionForModule(this.user,"Dealer View");

    this.viewAccess = await this.rolepermission.getRoleViewAccess();
    this.dashBoardAccess =this.viewAccess.roleType;
    let data =  localStorage.getItem('submenuValue')
    if(data != 'Contact Us' && data != 'Feedback'){
    let sortById = JSON.parse(localStorage.getItem('sortById'));
    if(sortById != undefined){
      this.model.documentSortName = sortById;
      this.actionSortItemEmit.emit(sortById)
    }
    let language = JSON.parse(localStorage.getItem('language'));
    if(language != undefined){
    this.model.languageId = language;
    this.actionLanguageItemEmit.emit(language)
    }
    let fileType = JSON.parse(localStorage.getItem('fileType'));
    if(fileType != undefined){
    this.model.documentFileType = fileType;
      this.actionTypeItemEmit.emit(fileType)
    }
  }
  else {
    let sortById = JSON.parse(localStorage.getItem('sortById'));
    if(sortById != undefined){
      this.model.documentSortName = sortById;
    }
    let language = JSON.parse(localStorage.getItem('language'));
    if(language != undefined){
    this.model.languageId = language;
    }
    let fileType = JSON.parse(localStorage.getItem('fileType'));
    if(fileType != undefined){
    this.model.documentFileType = fileType;
    }
  }

    if((this.dashBoardAccess == 'Dashboard View Access') && (!this.dealerView)&& (this.menuItems)){
    // this.onMenuItemClick(this.menuItems[0]);
    console.log('contact is clickig')
    this.allMenu = JSON.parse(localStorage.getItem('userMenu'));
    
    this.currentMenu=localStorage.getItem('currentMenuId');
    
    var newsideMenu=localStorage.getItem('currentsideMenuId'); 
      this.currentMenu = this.currentMenu.split("-");
      if(this.currentMenu[0] && this.currentMenu[1]){
        if(newsideMenu){
          for(let i=0;i<this.allMenu.length;i++){

            if(this.allMenu[i].id==this.currentMenu[0]){

              for(let j=0;j<this.allMenu[i].subMenu.length;j++){
                if(this.allMenu[i].subMenu[j].subMenuName==newsideMenu){

                  var sidebody = {"isActive":false,"name":newsideMenu,"id":this.allMenu[i].subMenu[j].subMenuId,"label":newsideMenu,"menuType":"link",
                  "link":this.allMenu[i].subMenu[j].subMenuUrl,"children":null,"parentId":this.allMenu[i].id,onClick: (e) => {
                    // todo
                  },};

                this.onMenuItemClick(sidebody);

                }
              }
            }
          }

        }else{

          var body = {"isActive":false,"name":this.currentMenu[1],"id":this.currentMenu[0]}
          this.onMenuItemClick(this.menuItems[0]);
        }
      }else{
        this.onMenuItemClick(this.menuItems[0]);
      }
      
    }
  }


  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuItems && changes.menuItems.previousValue) {
      this.resetParentRef();
    }
  }
onLanguage(){
  this.appliedLang = localStorage.getItem('Applylanguage');
  this.preferredLang = localStorage.getItem('preferred');
  this.userLangCode = localStorage.getItem('userLangCode');
 

  if(this.appliedLang){
    if(this.appliedLang == 'en-gb'){
      this.langMang = true;
    }
    else if(this.appliedLang == 'zh-cn'){
      this.langMang = false;
    }
  }
  else if(this.preferredLang){
    if(this.preferredLang == 'en-gb'){
      this.langMang = true;
    }
    else if(this.preferredLang == 'zh-cn'){
      this.langMang = false;
    }
  }
  else  if(this.userLangCode){
    if(this.userLangCode == 'en-gb'){
      this.langMang = true;
    }
    else if(this.userLangCode == 'zh-cn'){
      this.langMang = false;
    }
  }
}
  sortChange(val:any)
  {
    this.actionSortItemEmit.emit(val)
  }
  productChange(val:any)
  {
    this.actionProductEmit.emit(val)
  }
  
  

  typeChange(val:any)
  {
    this.actionTypeItemEmit.emit(val)
  }
  languageChange(val:any){
    this.actionLanguageItemEmit.emit(val)
  }
  onClearAll(val:any)
  {
    this.model.documentSortName = '';
    this.model.documentFileType = '';
    this.model.languageId = '';
    // this.model.documentSortId = null;
    // this.model.documentFileType = null;
    // this.model.languageId = null;
    this.actionTypeItemEmit.emit('');
    this.actionSortItemEmit.emit('');
    this.actionLanguageItemEmit.emit('')
    // window.location.reload();
    localStorage.removeItem('page');
    localStorage.removeItem('sortById');
    localStorage.removeItem('fileType');
    localStorage.removeItem('language');
    //val ="";
    //this.actionItemEmit.emit(val)
    //this.ngOnInit();
  }
  deliveredOrder(event:any){
    
    if (event.target.checked) { 
    this.checkedArray.push(event.target.defaultValue);
    this.actionOrderEmit.emit(this.checkedArray);
    }else{
      var val = null;
      const Index = this.checkedArray.indexOf(event.target.defaultValue);
      const uncheckedArray:any[] =  this.checkedArray.splice(Index,1); 
        this.actionOrderEmit.emit(this.checkedArray);
    }
  }
  // cancelledOrder(event:any){
  //   var val = 'Cancelled';
  //   if(event.target.checked){
     
  //     this.actionOrderEmit.emit(val);
  //   }else{
  //      val = null;
  //     this.actionOrderEmit.emit(val);
  //   }

  //  }
  //  processedOrder(event:any){
  //   var val = 'Processed';
  //   if(event.target.checked){
  //     this.actionOrderEmit.emit(val);
  //   }else{
  //      val = null;
  //     this.actionOrderEmit.emit(val);
  //   }
    
  //  }

  //  pendingOrder(event:any){
  //   var val = 'Pending';
  //   if(event.target.checked){ 
  //     this.actionOrderEmit.emit(val);
  //   }else{
  //      val = null;
  //     this.actionOrderEmit.emit(val);
  //   }
    
  //  }

   last60days(event:any){
    // if (event.target.checked) { 
    //   this.checkedOrderArray.push(event.target.defaultValue);
    //   this.actionOrderdaysEmit.emit(this.checkedOrderArray);
    //   }else{
    //     var val = null;
    //       this.actionOrderdaysEmit.emit(val);
    //   }
    
    var val = 60;
    if(event.target.checked){
      
      this.actionOrderdaysEmit.emit(val);
     // $('#checkbox5').prop('checked', false);
      $('#checkbox6').prop('checked', false);
      $('#checkbox7').prop('checked', false);
    }else{
       val = null;
      this.actionOrderdaysEmit.emit(val);
    }
    
   }

   last30days(event:any){
    var val = 30;
    if(event.target.checked){
      
      this.actionOrderdaysEmit.emit(val);
      $('#checkbox5').prop('checked', false);
      $('#checkbox7').prop('checked', false);
    }else{
       val = null;
      this.actionOrderdaysEmit.emit(val);
    }
  }
   


   older(event:any){
    var val = null;
    if(event.target.checked){ 
      this.actionOrderdaysEmit.emit(val);
      $('#checkbox5').prop('checked', false);
      $('#checkbox6').prop('checked', false);
    }else{
      val = null;
      this.actionOrderdaysEmit.emit(val);
    }
    
   }
   myorderClear(val:boolean){
    const val1 = null;
//$('.myordercheckbox').attr('checked', false);
     $('.myordercheckbox').prop('checked', false)
     this.orderModel.productFlag = null;
     this.actionOrderEmit.emit(val1);
    this.actionOrderdaysEmit.emit(val1);
    $('.myordercheckboxMV').prop('checked', false)
    //this.actionProductEmit.emit(val1);

   }

   sliderChanged(min:number,max:number)
   {
     this.orderModel.minPrice = min;
     this.orderModel.maxPrice = max;
    this.actionOrderRangeEmit.emit(this.orderModel);
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

  async onMenuItemClick(menu:any) {
    if(this.dealerViewEnable != 'true'){
      if(menu){
        localStorage.setItem('currentsideMenuId',menu.label);
  
      }
      if(!menu.isActive)
      {
        this.actionItemEmit.emit(menu)
        this.resetActiveMenu(menu);
        if (typeof menu?.onClick !== "undefined") { 
          // safe to use the function
          menu?.onClick(menu);
       }
        
      }
      else{
  
        this.actionItemEmit.emit(menu)
        menu.isActive = true
        menu?.onClick(menu);
      }
    }
    else {
      if (menu) {
        localStorage.setItem('currentsideMenuId', menu.label);
      }
      this.subchildMenuItem = await this.docservice.getsubchildMenuItem(menu.id, true);
      this.subChildMenu = Array.from(Object.values(this.subchildMenuItem))
      const addParent = (menu: NavbarMenuItem, parent: NavbarMenuItem) => {
        menu.parent = parent;
        if (menu.children) {
          menu.children.forEach(x => addParent(x, menu));
        }
      };
      this.subchildMenuItem.forEach(menuItem => addParent(menuItem, null));
      this.subchildMenuItem.forEach(x => x.isActive = false);
      if (!menu.isActive) {
        this.actionItemEmit.emit(menu)
        this.resetActiveMenu(menu);
        menu?.onClick(menu);
      }
      else {
        this.actionItemEmit.emit(menu)
        menu.isActive = true
        menu?.onClick(menu);
      }
  
    }
    
   
    
  }
  async onsubchildMenuItemClick(menu:any) {
      this.subchildMenuFourthItem = await this.docservice.getsubchildFourthMenu(menu.documentchildId, true);
      this.fouthchildmenu = Array.from(Object.values(this.subchildMenuFourthItem))
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
        // this.resetActiveMenu(menu);
      //   if (typeof menu?.onClick !== "undefined") { 
      //     menu.onClick(menu);
      //  }
      menu.isActive = false
      }
      else {
        this.actionchildFourthItemEmit.emit(menu)
        menu.isActive = true
      }
  
    
  }
  async onsubMenuItemClick(menu: any) {
    this.subchildMenuFourthItem.forEach((x:any) => {
      if(menu.idChildmenu == x.idChildmenu){
        x.isActive = true;
        this.actionchildLastItemEmit.emit(menu)
      }
      else{
        x.isActive = false
      }
    });
  }


  onFileSizeClick(filesize:any)
  {
    
  }

  resetActiveMenu(activeMenu: NavbarMenuItem): void {
    const setActiveFalse = (menu: NavbarMenuItem) => {
      menu.isActive = false;
      if (menu.children) {
        menu.children.forEach(x => setActiveFalse(x));
      }
    };
    
    this.menuItems.forEach(x => x.name ==activeMenu.name ? x.isActive =true : x.isActive =false);

    activeMenu.isActive = true;
    if (activeMenu.parent) {
      activeMenu.parent.isActive = true;
    }
  }
  resetActiveFourthMenu(activeMenu: NavbarMenuItem): void {
    const setActiveFalse = (menu: NavbarMenuItem) => {
      menu.isActive = false;
      if (menu.children) {
        menu.children.forEach(x => setActiveFalse(x));
      }
    };
    this.subchildMenuFourthItem.forEach(x => x.name ==activeMenu.name ? x.isActive =true : x.isActive =false);
    activeMenu.isActive = true;
    if (activeMenu.parent) {
      activeMenu.parent.isActive = true;
    }
  }
  
  onLogout(){
    this.oktaService.logout();
  }
  filterOptionVisible(){
     this.common.changeMessage1('navbarside',true);
     this.common.currentMessage1.subscribe((data:any)=>{
      if(data == 'header'){
        this.filterMobileView=false;
        // this.filterMobileView=!this.filterMobileView;
      }
      else{
        this.filterMobileView=true;
      }
     })
   
  }
  deliveredOrderMV(event:any){
    
    if (event.target.checked) { 
    this.MobilecheckedArray.push(event.target.defaultValue);
    }else{
      var val = null;
      const Index = this.MobilecheckedArray.indexOf(event.target.defaultValue);
      const uncheckedArray:any[] =  this.MobilecheckedArray.splice(Index,1); 
    }
  }
  mobileFilterSub(event:any){
    if (event.target.checked){
      this.actionOrderEmit.emit(this.MobilecheckedArray);
    }else{
      
        this.actionOrderEmit.emit(this.MobilecheckedArray);
    }

  }
  Days60Uncheck($event){
    $('#checkbox16').prop('checked', false);
    $('#checkbox17').prop('checked', false);

   }
   Days30Uncheck($event){
    $('#checkbox15').prop('checked', false);
    $('#checkbox17').prop('checked', false);

  }
  Days0Uncheck($event){
    $('#checkbox15').prop('checked', false);
      $('#checkbox16').prop('checked', false);

  }

   mobileOrderTime(event:any){
    // this.myOrderMobileFilter=!this.myOrderMobileFilter;
    var val = $('.myordercheckboxMV:checked').val();
    var valEmitted;
    if(val!=30 && val!=60){
      valEmitted=null;
    }else{
      valEmitted=val;
    }
    
    
    this.actionOrderdaysEmit.emit(valEmitted);
    if(val==60){
      $('#checkbox16').prop('checked', false);
      $('#checkbox17').prop('checked', false);
    }else if(val==30){
      $('#checkbox15').prop('checked', false);
      $('#checkbox17').prop('checked', false);
    }else if(val==0){
      $('#checkbox15').prop('checked', false);
      $('#checkbox16').prop('checked', false);
    }
    
  }
  MyOrderfilter(){
  
    this.myOrderMobileFilter=!this.myOrderMobileFilter;
    this.statusOrderContainer=!this.statusOrderContainer;
    this.orderTimeContainer=!this.orderTimeContainer;
    this.orderTypeContainer=!this.orderTypeContainer;
    this.sortByContainer=!this.sortByContainer;
    this.orderStatusHead=!this.orderStatusHead;
    this.orderTimeHead=!this.orderTimeHead;
    this.orderTypeHead=!this.orderTypeHead;
    this.sortByHead=!this.sortByHead;
  }

  orderStatusDrop(){
        this.orderStatusDropdown=true;
        this.orderTimeContainer=false;
        this.orderStatusHead=false;
        this.orderTypeContainer=false;
        this.sortByContainer=false;
      }
     orderTimeDrop(){
        this.orderTimeDropdown=true;
        this.statusOrderContainer=false;
        this.orderTimeHead=false;
        this.orderTypeContainer=false;
        this.sortByContainer=false;
      }
     orderTypeDrop(){
          this.orderTypeDropdown=true;
          this.statusOrderContainer=false;
          this.orderTypeHead=false;
          this.orderTimeContainer=false;
          this.sortByContainer=false;
        }
      sortBy(){
          this.sortByDropdown=true;
          this.statusOrderContainer=false;
          this.sortByHead=false;
          this.orderTimeContainer=false;
          this.orderTypeContainer=false;         
        
      }

      cancelFilter(){
        this.myOrderMobileFilter=false;
        this.orderStatusDropdown=false;
        this.orderTimeDropdown=false;
        this.orderTypeDropdown=false;
        this.sortByDropdown=false;
        this.statusOrderContainer=false;
        this.orderTimeContainer=false;
        this.orderTypeContainer=false;
        this.sortByContainer=false;
        this.orderStatusHead=false;
        this.orderTimeHead=false;
        this.orderTypeHead=false;
        this.sortByHead=false;
        
      }
      filterBack(){
        this.onClearAll("");
        this.filterMobileView=false
      }
      Applyfilter(){
        this.filterMobileView=false;
      }
}
