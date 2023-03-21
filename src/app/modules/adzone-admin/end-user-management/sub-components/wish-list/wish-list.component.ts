import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { DataLoadParams } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { IndependentcomponentserviceService } from 'src/app/shared/services/independentcomponentservice.service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { EndUserService } from '../../../services/end-user.service';
import { EndUserModelMapper, EndUserView } from '../../models/end-user-view.model';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jd-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {
  @Input() model: EndUserView;
  listModel: EndUserView[] = [];
  wishlist: any;
  RacfId: any;
  loading = false;
  documentFormArray: Array<any> = [];
  isCheckAll = false;
  page = 1;
  currentpage:any;
  pageOfItems: any[];
  config={id:'test', itemsPerPage: 12, currentPage: 1,totalItems:10 }
  params: DataLoadParams={page: 1,size: 12 };
  requestBody:any;
  currentIndex: number = -1;
  showFlag: boolean = false;
  listImageSelect: Array<EndUserView>;
  allSelected : boolean = false;
  selectAllBox: any;



  constructor(private cdr: ChangeDetectorRef,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private service: EndUserService,
    private intcompservice: IndependentcomponentserviceService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    public translate:TranslateService
    ) { 
     
    }

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
    this.loading = true;
    this.RacfId = this.userService.getRacfId();
    this.service.userRole = true;
    this.wishlist = await this.service.getAllWishList(this.RacfId,null,this.params);
    if (this.wishlist && this.wishlist.data && this.wishlist.data.content){
      this.config.totalItems = this.wishlist.data.totalElements;
      this.listModel = await Promise.all(this.wishlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
    this.loading = false;
    }else{
      this.loading = false;
      this.listModel = []
    }
  }
  async selectAllFields(event: any) {
    // console.log(event);
    if (event.target.checked) {
      this.isCheckAll = true;
      this.listModel.forEach(element => {
        element.isChecked = true;
        
      });
      this.allSelected = true;
      var isAll = 1;
      const result=await this.service.moveToAllcarttfromwishlist(isAll);
    } else {
      this.isCheckAll = false;
      this.listModel.forEach(element => {
        element.isChecked = false;
      });
      this.allSelected = false;
      var isAll = 0;
      const result=await this.service.moveToAllcarttfromwishlist(isAll);
      // this.loading = true;
    // this.RacfId = this.userService.getRacfId();
    // this.service.userRole = true;
    // this.wishlist = await this.service.getAllWishList(this.RacfId,null,this.params);
    // if (this.wishlist && this.wishlist.data && this.wishlist.data.content){
    //   this.config.totalItems = this.wishlist.data.totalElements;
    //   this.listModel = await Promise.all(this.wishlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
    // this.loading = false;
    // }else{
    //   this.loading = false;
    //   this.listModel = []
    // }
    }
  }
  async onSelectChange(docId: number,wishId:number, isChecked: any) {
    console.log('this.listModel',isChecked.target.checked,docId);
    if (isChecked.target.checked == true) {
      let currEl = this.listModel.find(x => x.documentFileId === docId)
      currEl.isChecked = isChecked.target.checked;
      console.log('this.listModel',this.listModel);
      var isAll = 1;
      const result=await this.service.moveToOnecarttfromwishlist(wishId,isAll);
      // console.log("true" + currEl);
    } else if (isChecked.target.checked == false) {
      this.allSelected=false; 
      this.selectAllBox = false;
      let currEl = this.listModel.find(x => x.documentFileId === docId)
      currEl.isChecked = isChecked.target.checked;
      console.log(this.listModel);
      var isAll = 0;
      const result=await this.service.moveToOnecarttfromwishlist(wishId,isAll);
     
    }
  }

  async moveToCart() {
    var y = this.listModel.find(x => x.isChecked === true);
    console.log(y)
    if (this.listModel.find(x => x.isChecked === true)) {
      // console.log(this.listModel)
      let selectedItems = [];
      var count = this.listModel.filter(x => x.isChecked === true).length;
      var countInt = 0;
      this.listModel.forEach((element, index) => {

        if (element.isChecked) {
          countInt++;
          // if (countInt != count)
           selectedItems.push(element.wishlistId)
           // data += "wishlistIdsList=" + element.wishlistId + "&"
          // else
          //   data += "wishlistIdsList=" + element.wishlistId;
        }
      });
      var isAll = this.allSelected == true ? 1 : 0;
      var data = "";
      data += "selectAll="+-1+"&racfId="+this.RacfId+"&Checked="+isAll;
      const result = await this.service.moveToCartfromWish(selectedItems,data);
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        this.listModel = this.listModel.filter(x => x.isChecked != true)
        this.service.CountChangeDetected = true;
        if (result?.message?.messageDescription.length){
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.ITEMMOVEDCART);
           });  
        }
        else
        {
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.MOVEDTOCART);
           });
        this.isCheckAll = false;
        this.allSelected = false;
      }
      }
    } else {
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.ATLEASTONEITEMMOVECART,AlertType.Critical);
       });
    }
  }
  async singleMovetoCart(item: any) {
    var dataItem = [];
    dataItem.push(item.wishlistId);
    var data = "";
      data += "racfId="+this.RacfId;
    const result = await this.service.moveToCartfromWish(dataItem, data);
    this.listModel = this.listModel.filter(x => x.wishlistId != item.wishlistId)
    this.service.CountChangeDetected = true;
    this.wishlist = await this.service.getAllWishList(this.RacfId,null,this.params);
      if (this.wishlist && this.wishlist.data && this.wishlist.data.content){
        this.config.totalItems = this.wishlist.data.totalElements;
        this.listModel = await Promise.all(this.wishlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
      this.loading = false;
      }else{
        this.loading = false;
        this.listModel = []
      }
    if (ApiErrorUtil.isError(result)) {
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      if (result?.message?.messageDescription.length){
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.ITEMMOVEDCART);
         });
        // this.alertService.show(result?.message?.messageDescription);

      }
      else
      {
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.MOVEDTOCART);
         });
        //  this.alertService.show("Moved to cart");
     
      // this.ngOnInit();
      // setTimeout(() => {
      //   window.location.href = '/master/wish-list';
      // }, 3000);
      }
      
    }
  }
  async removeFromWishlist() {
    if (this.listModel.find(x => x.isChecked === true)) {
      console.log(this.listModel)
      var data = "";
      var count = this.listModel.filter(x => x.isChecked === true).length;
      var countInt = 0;
      this.listModel.forEach((element, index) => {

        if (element.isChecked) {
          countInt++;
          console.log(countInt, count)
          if (countInt != count)
            data += "wishlistIdList=" + element.wishlistId + "&"
          else
            data += "wishlistIdList=" + element.wishlistId;
        }
      });
      const result = await this.service.removefromWish(data);
      
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        this.listModel = this.listModel.filter(x => x.isChecked != true)
        this.service.CountChangeDetected = true;
        if (result?.message?.messageDescription.length){
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.ITEMMOVEDCART);
           });
          // this.alertService.show(result?.message?.messageDescription);

        }
        else{
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.REMOVEDFROMWISHLIST);
           });
          // this.alertService.show("Removed from wishlist");
         
        }
        this.wishlist = await this.service.getAllWishList(this.RacfId,null,this.params);
        this.isCheckAll = false;
        if (this.wishlist && this.wishlist.data && this.wishlist.data.content){
          this.config.totalItems = this.wishlist.data.totalElements;
          this.listModel = await Promise.all(this.wishlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
        this.loading = false;
        }else{
          this.loading = false;
          this.listModel = []
        }
        // this.ngOnInit();
        // setTimeout(() => {
        //   window.location.href = '/master/wish-list';
        // }, 3000);
        // window.location.href = '/master/wish-list';
      }
    } else {
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.ATLEASTONEITEMREMOVEWISH,AlertType.Critical);
       });
    }
  }

  async singleRemovefromWish(item: any) {
    var data = "wishlistIdList=" + item.wishlistId;
    const result = await this.service.removefromWish(data);
    if (ApiErrorUtil.isError(result)) {
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      if (result?.message?.messageDescription.length){
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.ITEMREMOVED);
         });

      }
      else
      {
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.REMOVEDFROMWISHLIST);
         });
        //  this.alertService.show("Removed from wishlist");
     
      }
      this.listModel = this.listModel.filter(x => x.wishlistId != item.wishlistId);
      this.service.CountChangeDetected = true;

      this.wishlist = await this.service.getAllWishList(this.RacfId,null,this.params);
        if (this.wishlist && this.wishlist.data && this.wishlist.data.content){
          this.config.totalItems = this.wishlist.data.totalElements;
          this.listModel = await Promise.all(this.wishlist.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
        this.loading = false;
        }else{
          this.loading = false;
          this.listModel = []
        }
      // this.ngOnInit();
      // setTimeout(() => {
      //   window.location.href = '/master/wish-list';
      // }, 3000);
    }
  }
  goToDetailedScreen(selectedModel: any) {
    this.router.navigate(['/master/detailed-view/' + selectedModel?.documentId + '/' + selectedModel?.documentFileId]);
  
  }

  showLightbox(index) {
    this.currentIndex = index;
    this.listImageSelect = [this.listModel[this.currentIndex]];
    if (String(this.listImageSelect[0].extension).toLowerCase() != 'pdf') {

      this.showFlag = true;

    }
    else {

      window.open('master/pdf-view-full/' + this.listImageSelect[0].documentId + '/' + this.listImageSelect[0].documentFileId, '_blank');
    }


  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
  imageLoded(iteam: any) {

    const iterator = this.listModel.find(x => x.documentFileId == iteam.documentFileId);
    iterator.isLoaded = true;
    // console.log(this.listModel, iteam)
    //this.cdr.detectChanges();
  }

  async pageChanged(event: any) {
    this.loading = true;
    this.params.page = event;
    this.config.currentPage = event;
    const res:any = await this.service.getAllWishList(this.RacfId,null,this.params);
    if (!res || !res.data || !res.data.content) {
  
    }
    else {
      this.config.totalItems = res.data.totalElements;
      this.listModel = await Promise.all(res?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
      if (this.isCheckAll) {
        this.listModel.forEach(element => {
          element.isChecked = true;
          this.allSelected = true;
        });
      } else {
        this.listModel.forEach(element => {
          element.isChecked = false;
          this.allSelected = false;
        });
      }
      this.loading = false;
    }
  }

}
