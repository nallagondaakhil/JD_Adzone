import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { DataLoadParams } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { IndependentcomponentserviceService } from 'src/app/shared/services/independentcomponentservice.service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { EndUserService } from '../../../services/end-user.service';
import { RolePermissionService } from '../../../services/role-permission.service';
import { EndUserModelMapper, EndUserView } from '../../models/end-user-view.model';

@Component({
  selector: 'jd-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  @Input() model: EndUserView;
  listModel : EndUserView[] = [];
  documentlist:any;
  RacfId:any;
  loading = false;
  documentFormArray: Array<any> = [];
  isCheckAll = false;
  page = 1;
  currentpage:any;
  pageOfItems: any[];
  config={id:'test', itemsPerPage: 10, currentPage: 1,totalItems:10 }
  params: DataLoadParams={page: 1,size: 10 };
  requestBody:any;
  currentIndex: number = -1;
  showFlag:boolean = false;
  listImageSelect=[];
  permissionDownload:any;
  user = this.userService.getUserRoleId();
  allSelected : boolean = false;
  cartWish: any;
  selectAllBox: any;
  constructor(private cdr: ChangeDetectorRef ,
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private service: EndUserService,
    private intcompservice:IndependentcomponentserviceService,
    private http: HttpClient,
    private router: Router,
    private userService:UserService,
    private rolepermission:RolePermissionService,
    public translate:TranslateService
    ) { 
      let appliedLang = localStorage.getItem('Applylanguage')
      let preLang = localStorage.getItem('preLanguage')
      if(appliedLang){
        this.translate.use(appliedLang);
      }
      else if(preLang){
        this.translate.use(preLang);
      }
    }

  async ngOnInit(): Promise<void> {

    this.loading = true;
    this.checkPermission().then(x => {
    });
    this.service.userRole=true;
    this.RacfId = this.userService.getRacfId()
    this.documentlist =await this.service.getAllDocumentCart(null,this.params);
    // this.listModel = this.documentlist.data.content;
    if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
      this.config.totalItems = this.documentlist.data.totalElements;
      this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
//console.log(this.listModel);
      this.loading = false;
    }else{
      this.loading = false;
      this.listModel = []
    }


  }
  async checkPermission(){
    await this.rolepermission.getPermissionForModule(this.user,"Dealer View");
    //this.permissionView = await this.rolepermission.getRoleById("view_access");
    this.permissionDownload = await this.rolepermission.getRoleById("download_access");
  }
  async onSelectChange(docFileId:number,checked:any,userCartId:any, isChecked: boolean){
    console.log('checked',isChecked)
    if(isChecked) {
      let currEl = this.listModel.find(x => x.documentFileId === docFileId)
      currEl.isChecked = true;
      // this.listModel.forEach(element => {
      //   this.documentFormArray.push({'documentId':element.documentId,'racfId':this.RacfId})

      // });
      var isAll = 1;
      const result=await this.service.moveToOnewishlistfromcart(docFileId,userCartId,isAll);
      console.log('result',result)
    } else {
      let currEl = this.listModel.find(x => x.documentFileId === docFileId)
      currEl.isChecked = false;
      this.allSelected=false; 
      this.isCheckAll = false;
      this.selectAllBox = false;
      var isAll = 0;
      const result=await this.service.moveToOnewishlistfromcart(docFileId,userCartId,isAll);
      console.log('result',result)
      // let index = this.documentFormArray.indexOf(documentId);
      // this.documentFormArray.splice(index,1);
    }
  }
  async addWishlist(id:any,isWishlist: number,documentFileId:number,productFlag:number){
    let result;
    console.log(id,isWishlist,documentFileId,productFlag);
    if(isWishlist){
      this.loading = true;
      result=await this.service.removeWishlist(id,this.RacfId);
    }else{
      this.loading = true;
      result=await this.service.addWishlist(id,this.RacfId,documentFileId,productFlag);
      var wishlistID = this.listModel.find(x=>x.documentFileId == documentFileId);
      wishlistID.wishlistId=result.data.wishListId;
    }
    //this.ngOnInit()
    if (ApiErrorUtil.isError(result)) {
      // this.translate.get('HOME').subscribe((data:any)=> {
      //   console.log('dtat',data)
      //   this.alertService.show(data.FILEDOWNLOADSTART,AlertType.Warning);
      //  });
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {

      var temp = this.listModel.find(x=>x.documentFileId == documentFileId);
      temp.wishList =!isWishlist ?true:false;
   try{
    this.cdr.detectChanges()
   }
catch(e)
{
//console.log(e)
}


      if(result?.message?.messageDescription.length)
      {
        console.log(result?.message?.messageDescription)
        if(result?.message?.messageDescription == 'The item is removed from the wishlist successfully'){
          this.translate.get('HOME').subscribe((data:any)=> {
        
            this.alertService.show(data.ITEMREMOVED,AlertType.Warning);
           });
        }
        else{
          this.translate.get('HOME').subscribe((data:any)=> {
        
            this.alertService.show(data.ITEMADDED);
           });
        }
      }
      else
      {
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.STATUSUPDATEDSUCCESSFULLY);
         });

      }
      //this.onClose();
      this.service.CountChangeDetected =true;
      this.loading = false;

    }
  }
  async onSelectAll(event:any){
    if(event.target.checked){
      this.isCheckAll = true;
      this.listModel.forEach(element => {
        element.isChecked = true;
      });
      this.allSelected = true;
      var isAll = 1;
      const result=await this.service.moveToAllwishlistfromcart(isAll);
      console.log('result',result)
    }else{
      this.isCheckAll = false;
      this.listModel.forEach(element => {
        element.isChecked = false;
      });
      this.allSelected = false;
      var isAll =  0 ;
      const result=await this.service.moveToAllwishlistfromcart(isAll);
      console.log('result',result)
      
    }
  }
  async removeFromCart(id:number,userCartId:number){
    console.log('remove',this.documentFormArray)
    this.documentFormArray.length = 0;
    this.documentFormArray.push({'documentId':id,'createdBy':this.RacfId,'userCartId':userCartId})
    const result=await this.service.removeFromCart(this.documentFormArray);
    this.RacfId = this.userService.getRacfId()
    this.documentlist =await this.service.getAllDocumentCart(null,this.params);
    console.log('this.documentlist',this.documentlist)
    if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
      this.config.totalItems = this.documentlist.data.totalElements;
      this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
      this.loading = false;
    }else{
      this.loading = false;
      this.listModel = []
    }
    if (ApiErrorUtil.isError(result)) {
      this.translate.get('HOME').subscribe((data:any)=> {
        console.log('dta',data)
        this.alertService.show(data.FILEDOWNLOADSTART,AlertType.Warning);
       });
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      this.listModel = this.listModel.filter(x=>x.userCartId != userCartId)
      this.service.CountChangeDetected = true;
      if(result?.message?.messageDescription.length){
       
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.SELECTEDITEMREMOVE);
         });

      }
      else{
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.REMOVEDCART,AlertType.Warning);
         });
        this.documentlist =await this.service.getAllDocumentCart(null,this.params);
          if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
            this.config.totalItems = this.documentlist.data.totalElements;
            this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
            this.loading = false;
          }else{
            this.loading = false;
            this.listModel = []
          }
      }
        
        
    }
  }

  async MultipleRemoveFromCart(){

    if(this.listModel.find(x => x.isChecked === true)){
      var data;
      this.documentFormArray.length = 0;
      this.listModel.forEach(element => {
        if(element.isChecked){
          this.documentFormArray.push({'documentId':element.documentId,'createdBy':this.RacfId,'userCartId':element.userCartId,'documentFileId':element.documentFileId})
        }
      });
      // const model = EndUserModelMapper.mapToRemoveItemModel(data);
      const result=await this.service.MultipleremoveFromCart(this.documentFormArray);
      this.RacfId = this.userService.getRacfId()
      this.documentlist =await this.service.getAllDocumentCart(null,this.params);
      console.log('this.documentlist',this.documentlist)
      if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
        this.config.totalItems = this.documentlist.data.totalElements;
        this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
        this.loading = false;
      }else{
        this.loading = false;
        this.listModel = []
      }
      if (ApiErrorUtil.isError(result)) {
        this.translate.get('HOME').subscribe((data:any)=> {
         
          this.alertService.show(data.FILEDOWNLOADSTART,AlertType.Warning);
         });
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        if(result?.message?.messageDescription.length){
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.SELECTEDITEMREMOVE,AlertType.Warning);
           });
          //  this.alertService.show(result?.message?.messageDescription );
        }
         
        else
        {
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.REMOVEDCART,AlertType.Warning);
           });
           this.listModel = this.listModel.filter(x=> x.isChecked !=true)
           this.service.CountChangeDetected = true;
           this.isCheckAll = false;
           this.documentlist =await this.service.getAllDocumentCart(null,this.params);
           // this.listModel = this.documentlist.data.content;
           if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
             this.config.totalItems = this.documentlist.data.totalElements;
             this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
       //console.log(this.listModel);
             this.loading = false;
           }else{
             this.loading = false;
             this.listModel = []
           }
           // this.ngOnInit();
           // setTimeout(() => {
           //   window.location.href = '/master/shopping-cart';
           // }, 3000);
           // window.location.href = '/master/shopping-cart';
       }
        }
         
    }else{
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.ATLEASTONEITEM,AlertType.Critical);
       });
    }

  }
  async singleMovetoCart(item:any){
    var dataItem = [];
    dataItem.push(item.userCartId);
    var data = "";
    data += "racfId="+this.RacfId;
    const result = await this.service.moveTowishlistfromcart(dataItem, data);
    this.service.userRole=true;
    this.RacfId = this.userService.getRacfId()
    this.documentlist =await this.service.getAllDocumentCart(null,this.params);
    // this.listModel = this.documentlist.data.content;
    if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
      this.config.totalItems = this.documentlist.data.totalElements;
      this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
//console.log(this.listModel);
      this.loading = false;
    }else{
      this.loading = false;
      this.listModel = []
    }
    if (ApiErrorUtil.isError(result)) {
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.FILEDOWNLOADSTART,AlertType.Warning);
       });
      this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      this.listModel = this.listModel.filter(x=>x.userCartId != item.userCartId)
      this.service.CountChangeDetected = true;
      if(result?.message?.messageDescription.length){
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.ITEMMOVEDFRMCARTTOWISHLIST);
         });
      }
      else
      {
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.MOVEDWISHLIST);
         });
         this.documentlist =await this.service.getAllDocumentCart(null,this.params);
     // this.listModel = this.documentlist.data.content;
         if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
           this.config.totalItems = this.documentlist.data.totalElements;
           this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
     //console.log(this.listModel);
           this.loading = false;
         }else{
           this.loading = false;
           this.listModel = []
         }
         // this.ngOnInit();
         // setTimeout(() => {
         //   window.location.href = '/master/shopping-cart';
         // }, 3000);
      }
      
    }
  }


  async moveToCart(){
    if(this.listModel.find(x => x.isChecked === true)){
      var data="";
      var count = this.listModel.filter(x => x.isChecked === true).length;
      var countInt = 0;
      let selectedItems = [];
      // this.listModel.forEach((element,index) => {

      //   if(element.isChecked){
      //     countInt++;
      //     selectedItems.push(element.userCartId);
      //     // if(countInt != count)
      //     // data += "cartIdsList="+element.userCartId+"&"
      //     // else
      //     // data += "cartIdsList="+element.userCartId;
      //   }
      // });
      var isAll = this.allSelected == true ? 0 : 1;
      data += "selectAll="+-1+"&racfId="+this.RacfId+"&Checked="+isAll;
      console.log('selectedItems',selectedItems, data)
      const result=await this.service.moveTowishlistfromcart(selectedItems,data);
      this.service.userRole=true;
    this.RacfId = this.userService.getRacfId()
    this.documentlist =await this.service.getAllDocumentCart(null,this.params);
    // this.listModel = this.documentlist.data.content;
    if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
      this.config.totalItems = this.documentlist.data.totalElements;
      this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
//console.log(this.listModel);
      this.loading = false;
    }else{
      this.loading = false;
      this.listModel = []
    }
      if (ApiErrorUtil.isError(result)) {
        this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
      } else {
        this.listModel = this.listModel.filter(x=> x.isChecked !=true)
        this.service.CountChangeDetected = true;
        console.log(result?.message?.messageDescription.length);
        if(result?.message?.messageDescription.length){
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.ITEMMOVEDFROMWISHLISTTOCART);
           });
          // this.alertService.show(result?.message?.messageDescription );

        }
        else{
        this.cartWish = await this.service.getWishCartCount(this.RacfId);
        // console.log(this.cartWish);
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.MOVEDTOCART);
         });
        // this.alertService.show("Moved to cart");
        }
          this.documentlist =await this.service.getAllDocumentCart(null,this.params);
          // this.listModel = this.documentlist.data.content;
          if(this.documentlist && this.documentlist.data && this.documentlist.data.content){
            this.config.totalItems = this.documentlist.data.totalElements;
            this.listModel = await Promise.all(this.documentlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
      //console.log(this.listModel);
            this.loading = false;
          }else{
            this.loading = false;
            this.listModel = []
          }
          // this.ngOnInit();
          // setTimeout(() => {
          //   window.location.href = '/master/shopping-cart';
          // }, 3000);
          this.isCheckAll = false;
          this.allSelected = false;
          // window.location.href = '/master/shopping-cart';
      }
    }else{
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.ATLEASTONEITEMMOVE,AlertType.Critical);
       });
    }
  }

  async downloadDocuments(){
    //console.log(this.permissionDownload)
    if(this.permissionDownload == true){
      if(this.listModel.find(x => x.isChecked === true)){
        //console.log('flag',this.listModel)
        var docFileName;
        this.documentFormArray.length = 0;
        this.listModel.forEach(async (element,index) => {
          //console.log('listmdelelement',element)
          if(element.isChecked){
            if(element.downloadFlag == 'direct'){
              const imgUrl = element.downloadUrl;
              const imgName = element.documentFileName;
              const a = document.createElement('a');
              a.href = await this.toDataURL(imgUrl);
              console.log("a",a.href)
              a.download = imgName;
              document.body.appendChild(a);
              a.click();
              this.downloadcall(element.documentFileName, element.documentId, element.documentFileId, element.productFlag)
              document.body.removeChild(a);
            }
            // if(element.downloadFlag == 'direct'){
            //   const imgUrl = element.downloadUrl;
            //   const imgName = imgUrl.substr(imgUrl.lastIndexOf("/") + 1);
            //   this.http
            //     .get(imgUrl, { responseType: "blob" as "json" })
            //     .subscribe((res: any) => {
            //       try {
            //         const file = new Blob([res], { type: res.type });
            //         const blob = window.URL.createObjectURL(file);
            //         const link = document.createElement("a");
            //         link.href = blob;
            //         link.download = imgName;
            //         this.downloadcall(element.documentFileName, element.documentId, element.documentFileId, element.productFlag)
            //         // Version link.click() to work at firefox
            //         link.dispatchEvent(
            //           new MouseEvent("click", {
            //             bubbles: true,
            //             cancelable: true,
            //             view: window
            //           })
            //         );
            //         setTimeout(() => {
            //           // firefox
            //           window.URL.revokeObjectURL(blob);
            //           link.remove();
            //         }, 100);
            //       }
            //       catch (err) {
            //         //console.log(err)
            //       }
            //       // IE
            //       // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //       //   window.navigator.msSaveOrOpenBlob(file);
            //       //   return;
            //       // }
            //     });
            // }
            else{
              docFileName = element.documentFileName;
              this.documentFormArray.push({'documentId':element.documentId,'racfId':this.RacfId,'documentFileId':element.documentFileId})
              const url = await this.service.downloadFile(element.documentFileName);
              this.translate.get('HOME').subscribe((data:any)=> {
                this.alertService.show(data.FILEDOWNLOADSTART,AlertType.Warning);
               });
                // this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    
              DownloadUtil.downloadFile(this.http, url, element.documentFileName , 'img_download');
            }
            
          }
  
        });
        const result1=await this.service.placeDownloadOrder(this.documentFormArray);
        // this.ngOnInit();
        // setTimeout(() => {
        //   window.location.href = '/master/shopping-cart';
        // }, 3000);
        this.listModel = this.listModel.filter(x=> x.isChecked !=true)
        this.service.CountChangeDetected = true;
        this.isCheckAll = false;
      }else{
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.ATLEASTONEITEMDOWNLOAD,AlertType.Critical);
         });
        // this.alertService.show("Please Select at least 1 item to download.", AlertType.Critical);
      }
    }
    
  }
  toDataURL(url) {
    console.log("url",url)
    return fetch(url).then((response) => {
      return response.blob();
    }).then(blob => {
      return URL.createObjectURL(blob);
    });
  }
  async downloadcall(documentFile: any, documentID: any, documentFileId: any, productFlag: number) {
    this.documentFormArray.length = 0;
    var result1;
    this.documentFormArray.push({ 'documentId': documentID, 'racfId': this.RacfId, 'documentFileId': documentFileId, 'quantity': 1, 'productFlag': 0 })
    result1 = await this.service.placeDownloadOrder(this.documentFormArray);
    if (result1.message) {
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.FILEDOWNLOADSTART,AlertType.Warning);
       });
      // this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
      this.service.CountChangeDetected = true;
    }
  }
//   downloadFile(url: string) {
//     const mapForm = document.createElement('form');
//     mapForm.target = '_self' || '_blank';
//     mapForm.id = 'stmtForm';
//     mapForm.method = 'POST';
//     mapForm.action = url;

//     const mapInput = document.createElement('input');
//     mapInput.type = 'hidden';
//     mapInput.name = 'Data';
//     mapForm.appendChild(mapInput);
//     document.body.appendChild(mapForm);
//     mapForm.submit();
// }
goToDetailedScreen(selectedModel:any){
  this.router.navigate(['/master/detailed-view/'+selectedModel?.documentId+'/'+selectedModel?.documentFileId]);
}

showLightbox(index) {
  this.currentIndex = index;
  this.showFlag = true;
  this.listImageSelect=[this.listModel[this.currentIndex]];
  if(String(this.listImageSelect[0].documentFileType).toLowerCase()!='pdf')
  {
    this.showFlag = true;
  }
  else{

        window.open('master/pdf-view-full/'+this.listImageSelect[0].documentId+'/'+this.listImageSelect[0].documentFileId,'_blank');
  }

}

closeEventHandler() {
  this.showFlag = false;
  this.currentIndex = -1;
}
imageLoded(iteam:any)
{

const iterator=this.listModel.find(x=>x.documentFileId ==iteam.documentFileId);
iterator.isLoaded =true;
//console.log(this.listModel,iteam)
//this.cdr.detectChanges();
}

async pageChanged(event: any) {
  this.loading = true;
  this.params.page = event;
  this.config.currentPage = event;
  const res:any = await this.service.getAllDocumentCart(null,this.params);
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
