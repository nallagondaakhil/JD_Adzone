import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { DataLoadParams } from 'src/app/shared/components/data-table/models/data-table-model';
import { resourceLimits } from 'worker_threads';
import { AdminNotificationService } from '../services/admin-notification.service';
import { AdminNotificationModelMapper, NotificationView } from './models/admin-notification-view.model';
import { EndUserService } from '../services/end-user.service';
import { RolePermissionService } from '../services/role-permission.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'jd-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  config={id:'test', itemsPerPage: 10, currentPage: 1,totalItems:10 }
  params: DataLoadParams={page: 1,size: 10, };
  requestBody:any;
  modelList:Array<NotificationView>;
  modelNewlList:Array<NotificationView>;
  modelReadlList:NotificationView[];
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
    private service: AdminNotificationService,
    private userService: UserService,
    private endservice:EndUserService,
    private router: Router,
    private rolepermission:RolePermissionService,
    public translate:TranslateService
  ) {
    
   }

  async ngOnInit(): Promise<void> {
    this.endservice.userRole=true;
    this.endservice.downloadFilter=false;
    this.isAdmin = this.userService.isAdmin();
    this.isSubRegionAdmin = this.userService.isSubRegionAdmin();
    this.isVendor = this.userService.isVendor();
    this.isJdUser = this.userService.isJdUser();
    this.isDealer = this.userService.isDealer();
    this.roleId = this.userService.getUserRoleId();
    let view = JSON.parse(localStorage.getItem('dealerView'))
    this.dealerView = view;
    let result;
    
    result = await this.service.getAll(this.params,this.requestBody);

    if(result && result.data && result.data.content){
      this.config.totalItems=result.data.totalElements;
      const viewModels = await Promise.all(result?.data?.content?.map((x: any) => AdminNotificationModelMapper.mapToViewModel(x)));
      this.modelList=viewModels;
      this.modelNewlList = viewModels.filter((x:any)=> x?.isRead==false);
      this.modelReadlList = viewModels.filter((x:any)=> x?.isRead==true);
      console.log(this.modelNewlList,this.modelReadlList)
      
    }
    const resnoti = await this.service.updateasRead({},{});

    await this.rolepermission.getPermissionForModule(this.roleId,"Dashboard");
    await this.rolepermission.getPermissionForModule(this.roleId,"Dealer View");

    this.viewAccess = await this.rolepermission.getRoleViewAccess();
    this.dashBoardAccess =this.viewAccess.roleType;
    // if(resnoti){
    //   this.service.miniNotificationCount = resnoti.data.unreadCount;
    // }
    // if(window.innerWidth<=576)
    // {
    //   this.pagenumber = 5;
    // }
    // else{
    //   this.pagenumber = 7;
    // }
    // const resnoti = await this.service.updateNotification();
    //   if(resnoti){
        // this.service.miniNotificationCount = resnoti.data.unreadCount;
      // }
  }

  viewOrderDashboard(){
    if(this.dashBoardAccess == 'Dashboard View Access'){
      window.location.href='/master/order-list';
      localStorage.setItem('currentMenuId','6-Manage Order');
      localStorage.setItem('currentsideMenuId','Manage Downloads');
    }
  }
  // redirect(){
  //   if(this.isAdmin || this.isSubRegionAdmin){
  //     this.router.navigate(['/master/order-list']);
  //   }else if(this.isJdUser || this.isDealer || this.isVendor || this.dealerView){
  //     this.router.navigate(['/master/my-orders']);
  //   }
  // }

  async pageChanged(event:any)
  {
    this.params.page=event;
    this.config.currentPage=event;
    const res = await this.service
    .getAll(this.params,this.requestBody);
    if (!res || !res.data || !res.data.content) {
      
    }
    else
    {
      this.config.totalItems=res.data.totalElements;
      const viewModels = await Promise.all(res?.data?.content.map((x: any) => AdminNotificationModelMapper.mapToViewModel(x)));
      //console.log(viewModels);
      this.modelList=viewModels;
      this.modelNewlList = viewModels.filter((x:any)=> x?.isRead == false);
      this.modelReadlList = viewModels.filter((x:any)=> x?.isRead == true);

    }
  }
  dealerViewOrderList(){
    window.location.href='/master/my-orders';
  }
  dashboardViewOrderList(){
    window.location.href='/master/order-list';
  }
}
