import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { mainModules, roleModel } from '../../../models/role-master.model';
import { RoleService } from '../../../services/role-management.service';
import { RolePermissionService } from '../../../services/role-permission.service';
import { roleListViewModel, RoleModelMapper, roleViewModel } from '../../models/role-view.model';
import { RolesDependancyClass } from "src/app/shared/utils/roles-dependancy.util";


// import { RoleAccessModel, RoleModel, RoleModulesModel } from "../../models/role.model";

@Component({
  selector: 'jd-add-edit-role-management',
  templateUrl: './add-edit-role-management.component.html',
  styleUrls: ['./add-edit-role-management.component.scss']
})
export class AddEditRoleManagementComponent implements OnInit {
  roleKey:any;
  editValue:boolean = false;
  title = '';
  buttonText='';
  loading = false;
  isEdit = false;
  showUpload = false;
  roleTypeValues: any = [
    {
      roleTypeId: 1,
      name: 'Dashboard View Access',
    },
    {
      roleTypeId: 2,
      name: 'Dealer View Access',
    }
  ];
  @Output() closed = new EventEmitter();
  curentStatus: string;
  @ViewChild('roleForm', { static: false }) form: NgForm;
  @Input() model: roleViewModel;
  @Input() roleListModel: roleListViewModel;
  @ViewChild('dataTable') dataTable: DataTableComponent;
  modulesList: roleViewModel[] = [];
  constructor(
    private alertService: AlertsService,
    private modalService: ModalDialogService,
    private masterDataService: MasterDataService,
    private roleService: RoleService,
    private userService: UserService,
    public rolepermissionService:RolePermissionService,
    ) { 
    }

  async ngOnInit() {
    this.isEdit = this.model ? true : false;
    this.title = this.model ? 'Update Role' : 'Add Role';
    this.buttonText = this.model ? 'Update' : 'Submit';
    
    this.model = this.model || {} as any;
    if(!this.isEdit){
      const res = await this.roleService.getAllModules();
      const model:roleModel = {};
      if (res && res?.data) {
        model.roleAccessControls = res.data;
        this.model = await  RoleModelMapper.mapToViewModel(model,null)
      }
    }else{
      const res = await this.roleService.getModulesByRoles(this.model.roleId);
      const model:roleModel = {}
      model.roleType = this.model.roleType;
      this.roleKey = this.model.roleName;
      if (res && res?.data) {
        model.roleAccessControls = res.data;
        var roleId = this.model.roleId
        var roleName = this.model.roleName
        if(roleName == 'Sub Region Admin' || roleName == 'Dealer' || roleName == 'Super Admin' || roleName == 'John Deere Employee' || roleName == 'Vendor'){
          this.editValue = true;
        }
        var roleType = this.model.roleType
        this.model = await  RoleModelMapper.mapToViewModel(model,null)
        this.model.roleId = roleId;
        this.model.roleName = roleName;
        this.model.roleType = roleType;
      }
    }
  }

  rolePermission(event:any){
    if(event?.length){
      if(event[0].roleTypeId == 1){
      let item = this.model.permission.find(x=>x.modulesName.toLocaleLowerCase() == "dashboard")
      let subModule = item.subModules.find(x=>x.slugName.toLocaleLowerCase() == "view_access_dashboard")
      subModule.isCheckedFlag = 1;
      let dealerItem = this.model.permission.find(x=>x.modulesName.toLocaleLowerCase() == "dealer view")
      let dSubModule = dealerItem.subModules.find(x=>x.slugName.toLocaleLowerCase() == "view_access")
      dSubModule.isCheckedFlag = 0;
      }
      else if(event[0].roleTypeId == 2){
      let item = this.model.permission.find(x=>x.modulesName.toLocaleLowerCase() == "dashboard")
      let subModule = item.subModules.find(x=>x.slugName.toLocaleLowerCase() == "view_access_dashboard")
      subModule.isCheckedFlag = 0;
      let dealerItem = this.model.permission.find(x=>x.modulesName.toLocaleLowerCase() == "dealer view")
      let dSubModule = dealerItem.subModules.find(x=>x.slugName.toLocaleLowerCase() == "view_access")
      dSubModule.isCheckedFlag = 1;
      }
    }else{
      let item = this.model.permission.find(x=>x.modulesName.toLocaleLowerCase() == "dashboard")
      let subModule = item.subModules.find(x=>x.slugName.toLocaleLowerCase() == "view_access_dashboard")
      subModule.isCheckedFlag = 0;
      let dealerItem = this.model.permission.find(x=>x.modulesName.toLocaleLowerCase() == "dealer view")
      let dSubModule = dealerItem.subModules.find(x=>x.slugName.toLocaleLowerCase() == "view_access")
      dSubModule.isCheckedFlag = 0;
    }
  }

  onClose() {
    this.closed.emit();
  }
  onCloseUploadModal(e:any){
    this.showUpload = false;
    this.dataTable.redrawGrid();
  }
  onStatusChange(status: string) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'Active' ? 'Activate User' : 'Deactivate Role',
        message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this role?`,
        okText: 'Yes',
        okCallback: async () => {
          this.modalService.publisher.next(null);
          resolve(true);
        },
        cancelText: 'No',
        cancelCallback: () => {
          this.modalService.publisher.next(null);
          resolve(false);
        },
        modalType: ModalType.warning,
        isSecondModal: true
      });
    });
  }
  disableDealer(v: boolean, i: number, moduleIndex: number){
    if(this.roleKey == 'Super Admin'){
      if(moduleIndex == 9 && i == 4){
        return true;
      }
      if(moduleIndex == 7){
        return true;
      }
      return false;
    }
    if(this.roleKey == 'Sub Region Admin'){
      if(moduleIndex == 4 && i<=4){
        return false;
      }if(moduleIndex == 5 && i<=4){
        return false;
      }if(moduleIndex == 6 && i<=4){
        return false;
      }if(moduleIndex == 7){
        return true;
      }if(moduleIndex == 8){
        return false;
      }if(moduleIndex == 11){
        return false;
      }if(moduleIndex == 12){
        return false;
      }
    }
    if(this.roleKey == 'Vendor'){
      return false;
      // if(moduleIndex == 11){
      //   return false;
      // }if(moduleIndex == 12){
      //   return false;
      // }
    }
    if(this.roleKey == 'Dealer'){
      return false;
      // if(moduleIndex == 11){
      //   return false;
      // }if(moduleIndex == 12){
      //   return false;
      // }
    }
    if(this.roleKey == 'John Deere Employee'){
      return false;
      // if(moduleIndex == 11){
      //   return false;
      // }if(moduleIndex == 12){
      //   return false;
      // }
    }
  }
  updateSubModule(v: boolean, i: number, moduleIndex: number) {
    //var error="yu";
    console.log("error");
    
    (this.model.permission[moduleIndex].subModules[i]).isCheckedFlag = v ? 0 : 1;
    let item = RolesDependancyClass.rolesDependancy.find(x=>{if(x.key.toLocaleLowerCase() == this.model.permission[moduleIndex].modulesName.toLocaleLowerCase()){return true}})
    item.subModules.forEach(element => {
      if(this.model.permission[moduleIndex].subModules[i].subModulesName.toLocaleLowerCase() == element.key.toLocaleLowerCase() && this.model.permission[moduleIndex].subModules[i].isCheckedFlag == 1){
        
        element?.dependency?.forEach(prop => {
          const dependency = this.model.permission[moduleIndex].subModules.find(x=>x.subModulesName.toLocaleLowerCase() == prop.toLocaleLowerCase());
          if(dependency){
            dependency.isCheckedFlag= 1;
          }
        });
      }
    });
   
  }
  onCreateUpdate(status: string,model:any,result:any) {
    return new Promise((resolve) => {
      this.modalService.show({
        title: status === 'create' ? 'Create Role' : 'Update Role',
        message: `Are you sure you want to ${status === 'create' ? 'Create' : 'Update'} this role?`,
        okText: 'Yes',
        okCallback: async () => {
          if(status === 'create')
          result = await this.roleService.create(model);
          else
          result = await this.roleService.update(model);
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            if(result?.message?.messageDescription.length)
              this.alertService.show(result?.message?.messageDescription );
            else
              this.alertService.show("Status Updated Successfully");
            this.onClose();
            this.rolepermissionService.checkDealview = false;
            this.rolepermissionService.checkMenuAccess = false;
            this.showUpload = true;
          }
          this.modalService.publisher.next(null);
          resolve(true);
        },
        cancelText: 'No',
        cancelCallback: () => {
          this.modalService.publisher.next(null);
          resolve(false);
        },
        modalType: ModalType.warning,
        isSecondModal: true
      });
    });
  }
  async onsave(){
    this.form.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    try {
      const model = RoleModelMapper.mapToModel(this.model,this.userService);
      let result: ApiResponse<mainModules>;
      if (this.isEdit) {
        let res;
        if (this.curentStatus !== this.model.activateFlag) {
          res = await this.onStatusChange(this.model.activateFlag);
          
          if (!res) {
            return;
          }
        }
        this.loading = true;
        await this.onCreateUpdate("update",model,result);
      } else {
        model.activateFlag = 1;
        await this.onCreateUpdate("create",model,result);
      }
    } catch (error) {
      if(this.isEdit){
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update role', AlertType.Critical);

      }else{
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add role', AlertType.Critical);

      }
    }
    this.loading = false;
  }
  onClear() {
    this.onClose();
   }

}
