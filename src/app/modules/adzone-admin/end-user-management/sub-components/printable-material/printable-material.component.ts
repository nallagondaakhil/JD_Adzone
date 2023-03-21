import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataModel } from 'src/app/modules/admin/models/master-data.model';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { IndependentcomponentserviceService } from 'src/app/shared/services/independentcomponentservice.service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { AddressMasterModel } from '../../../models/address-master.model';
import { EndUserService } from '../../../services/end-user.service';
import { AddressModelMapper, AddressView } from '../../models/address-view.model';
import { EndUserModelMapper, EndUserView } from '../../models/end-user-view.model';

@Component({
  selector: 'jd-printable-material',
  templateUrl: './printable-material.component.html',
  styleUrls: ['./printable-material.component.scss']
})
export class PrintableMaterialComponent implements OnInit {

  @Input() model: EndUserView;
  listModel : EndUserView[] = [];
  // addressModel : AddressView;
  @Input() addressModel: AddressView;
  documentlist:any;
  addressList:any;
  documentFormArray: Array<any> = [];
  RacfId:any;
  loading = false;
  count : number = 0;
  isCheckAll = false;
  isEdit: boolean;
  viewModels:any[];
  showAddAddress = false;
  currAddressId:number;
  userId:number;
  countryOptions: MasterDataModel[];
  isDealer:boolean;
  orderTotal = 0;
  orderPrice = 0;
  @ViewChild('addressForm', { static: false }) form: NgForm;
  constructor(private cdr: ChangeDetectorRef ,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private service: EndUserService,
    private intcompservice:IndependentcomponentserviceService,
    private http: HttpClient,
    private router: Router,
    private userService:UserService) { }

  async ngOnInit(): Promise<void> {
    this.isDealer = this.userService.isDealer();
    this.isEdit = this.model ? true : false;
    this.userId = this.userService.getUserId();
    this.countryOptions =await this.service.getUserCountries(this.userId);
    this.RacfId = this.userService.getRacfId()
    this.documentlist =await this.service.getAllPrintableCart(this.RacfId);
    if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
    this.listModel = await Promise.all(this.documentlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
    }else{
      this.listModel = []
    }
    console.log(this.listModel)
    this.loadAddress();
    this.calculateOrderPrice();
    this.addressModel = this.addressModel || {} as any;
  }
  async loadAddress(){
    this.addressList = await this.service.getAddress(this.RacfId);
    if(this.addressList && this.addressList.data){
      this.viewModels = await Promise.all(this.addressList?.data?.map((x: any) => AddressModelMapper.mapToViewModel(x)));
    }else{
      this.viewModels = []
    }
  }
  calculateOrderPrice(){
    console.log("from",this.listModel)
    this.orderTotal = 0;
    this.listModel.forEach(element => {
      if(element.isChecked)
      this.orderTotal += parseInt(element.price) * element.count;
    })
  }
  async addWishlist(id:any,isWishlist: number,documentFileId:number,productFlag:number){
    let result;
    if(isWishlist){
      this.loading = true;
      result=await this.service.removeWishlist(id,this.RacfId);
    }else{
      this.loading = true;
      result=await this.service.addWishlist(id,this.RacfId,documentFileId,productFlag);
    }
    this.ngOnInit()
    // setTimeout(() => {
    //   window.location.href = '/master/printable-material';
    // }, 3000);
    this.service.CountChangeDetected =true;
    if (ApiErrorUtil.isError(result)) {
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      if(result?.message?.messageDescription.length)
        this.alertService.show(result?.message?.messageDescription );
      else
        this.alertService.show("Status Updated Successfully");
      //this.onClose();
      this.loading = false;
    }
  }

  async removeFromCart(id:number,userCartId:number){
    this.documentFormArray.length = 0;
    this.documentFormArray.push({'documentId':id,'createdBy':this.RacfId,'userCartId':userCartId})
    const result=await this.service.removeFromCart(this.documentFormArray);
    if (ApiErrorUtil.isError(result)) {
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      if(result?.message?.messageDescription.length)
        this.alertService.show(result?.message?.messageDescription );
      else
        this.alertService.show("Removed from cart");
        this.ngOnInit();
        setTimeout(() => {
          window.location.href = '/master/printable-material';
        }, 3000);
    }
  }
  async onSelectChange(docFileId:number, isChecked: boolean){
    if(isChecked) {
      let currEl = this.listModel.find(x => x.documentFileId === docFileId)
      currEl.isChecked = true;
      // this.listModel.forEach(element => {
      //   this.documentFormArray.push({'documentId':element.documentId,'racfId':this.RacfId})

      // });
    } else {
      let currEl = this.listModel.find(x => x.documentFileId === docFileId)
      currEl.isChecked = false;
      // let index = this.documentFormArray.indexOf(documentId);
      // this.documentFormArray.splice(index,1);
    }
    this.calculateOrderPrice();
  }

  async placeOrder()
  {

    if(this.listModel.find(x => x.isChecked === true)){
      if(this.currAddressId != null){
        this.documentFormArray.length = 0;
        var data;
        this.listModel.forEach(element => {
          if(element.isChecked){
            console.log(element)
            this.documentFormArray.push({'documentId':element.documentId,'racfId':this.RacfId,'quantity':element.count,'documentFileId':element.documentFileId,'addressId':this.currAddressId,'orderAmount':element.price})
          }
        });
        // const model = EndUserModelMapper.mapToRemoveItemModel(data);
        const result=await this.service.placeOrder(this.documentFormArray);
        if (ApiErrorUtil.isError(result)) {
          this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
        } else {
          if(result?.message?.messageDescription.length)
            this.alertService.show(result?.message?.messageDescription );
          else
            this.alertService.show("Removed from cart");
            this.ngOnInit();
            setTimeout(() => {
              window.location.href = '/master/printable-material';
            }, 3000);
            // window.location.href = '/master/printable-material';
            this.isCheckAll = false;
        }
      }else{
        this.alertService.show("Please select an address to place order.", AlertType.Critical);
      }
    }else{
      this.alertService.show("Please select at least 1 item to place order.", AlertType.Critical);
    }
  }

  async singleMovetoCart(item:any){
    var data = "cartIdsList="+item.userCartId;
    const result = await this.service.moveTowishlistfromcart(data);
    if (ApiErrorUtil.isError(result)) {
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      if(result?.message?.messageDescription.length)
        this.alertService.show(result?.message?.messageDescription );
      else
        this.alertService.show("Moved to wishlist");
        this.ngOnInit();
        setTimeout(() => {
          window.location.href = '/master/printable-material';
        }, 3000);
    }
  }

  setAddress(addressID?:number){
    this.currAddressId = addressID
  }

  async moveToCart(){
    if(this.listModel.find(x => x.isChecked === true)){
      var data="";
      var count = this.listModel.filter(x => x.isChecked === true).length;
      var countInt = 0;
      this.listModel.forEach((element,index) => {

        if(element.isChecked){
          countInt++;
          if(countInt != count)
          data += "cartIdsList="+element.userCartId+"&"
          else
          data += "cartIdsList="+element.userCartId;
        }
      });
      const result=await this.service.moveTowishlistfromcart(data);
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        if(result?.message?.messageDescription.length)
        {
          this.alertService.show(result?.message?.messageDescription );
          this.service.CountChangeDetected =true;
        }

        else
        {

          this.alertService.show("Moved to cart");
          this.ngOnInit();
          this.service.CountChangeDetected =true;
        }

          // setTimeout(() => {
          //   window.location.href = '/master/printable-material';
          // }, 3000);
          // window.location.href = '/master/printable-material';
          this.isCheckAll = false;
      }
    }else{
      this.alertService.show("Please select at least 1 item to move from cart.", AlertType.Critical);
    }
  }
  handleIncrease(item:any){

    let currEl = this.listModel.find(x => x.documentFileId === item.documentFileId)
      currEl.count = currEl.count+1;
      console.log(this.listModel);
      this.orderTotal += parseInt(currEl.price);
  }

  handleDecrease(item:any){

    let currEl = this.listModel.find(x => x.documentFileId === item.documentFileId)
    if(currEl.count>1){
      currEl.count = currEl.count-1;

      this.orderTotal -= parseInt(currEl.price);
    }
    console.log(this.listModel);
  }

  selectAllFields(event:any){
    if(event.target.checked){
      this.isCheckAll = true;
      this.listModel.forEach(element => {
        element.isChecked = true;
      });
    }else{
      this.isCheckAll = false;
      this.listModel.forEach(element => {
        element.isChecked = false;
      });
    }
    this.calculateOrderPrice();
  }


  async MultipleRemoveFromCart(){

    if(this.listModel.find(x => x.isChecked === true)){
      this.documentFormArray.length = 0;
      var data;
      this.listModel.forEach(element => {
        if(element.isChecked){
          this.documentFormArray.push({'documentId':element.documentId,'createdBy':this.RacfId,'userCartId':element.userCartId,'documentFileId':element.documentFileId})
        }
      });
      // const model = EndUserModelMapper.mapToRemoveItemModel(data);
      const result=await this.service.MultipleremoveFromCart(this.documentFormArray);
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        if(result?.message?.messageDescription.length)
          this.alertService.show(result?.message?.messageDescription );
        else
          this.alertService.show("Removed from cart");
          this.ngOnInit();
          setTimeout(() => {
            window.location.href = '/master/printable-material';
          }, 3000);
          // window.location.href = '/master/printable-material';
          this.isCheckAll = false;
      }
    }else{
      this.alertService.show("Please select at least 1 item to remove from cart.", AlertType.Critical);
    }

  }

  async onSave(){
    this.form.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    try {
      const model = AddressModelMapper.mapToModel(this.addressModel,this.userService);
      let result: ApiResponse<AddressMasterModel>;
      if (this.isEdit) {

        this.loading = true;
        result = await this.service.updateAddress(model);
      } else {
        result = await this.service.createAddress(model);
      }
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        if(result?.message?.messageDescription.length)
          this.alertService.show(result?.message?.messageDescription );
        else
          this.alertService.show("Status Updated Successfully");
        this.onClose();
      }
    } catch (error) {
      if(this.isEdit){
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update address', AlertType.Critical);

      }else{
        this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add address', AlertType.Critical);

      }
    }
    this.loading = false;
  }

  onEdit(selectedModel:any){
    this.addressModel = selectedModel;
    this.isEdit = true;
    $("#collapseTwo-2").addClass("show");
    $("#collapseTwo-1").removeClass("show");
  }

  onClose(){
    // this.addressModel = {} as any;
    this.form.resetForm();
    this.showAddAddress = false;
    $("#collapseTwo-2").removeClass("show");
    $("#collapseTwo-1").addClass("show");
    this.loadAddress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCancel(){
    this.addressModel = {} as any;
    this.form.resetForm();
  }

  async onRemoveAddress(id:number){
    const data = {'addressId':id}
    const result=await this.service.deleteAddress(data);
    if (ApiErrorUtil.isError(result)) {
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      if(result?.message?.messageDescription.length)
        this.alertService.show(result?.message?.messageDescription );
      else
        this.alertService.show("Address Removed Successfully");
      this.loadAddress();
    }
  }
  goToDetailedScreen(selectedModel:any){
    this.router.navigate(['/master/detailed-view/'+selectedModel?.documentId+'/'+selectedModel?.documentFileId]);
  }
}
