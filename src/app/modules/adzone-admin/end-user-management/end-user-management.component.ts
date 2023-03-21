import { Options } from '@angular-slider/ngx-slider';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { DataLoadParams } from 'src/app/shared/components/data-table/models/data-table-model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { IndependentcomponentserviceService } from 'src/app/shared/services/independentcomponentservice.service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { EndUserMasterModel, EndUserPayLoad } from '../models/end-user-master.model';
import { BannerService } from '../services/banner.service';
import { EndUserService } from '../services/end-user.service';
import { EndUserModelMapper, EndUserView } from './models/end-user-view.model';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { RolePermissionService } from '../services/role-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MasterDataService } from '../../admin/services/master-data.service';

@Component({
  selector: 'jd-end-user-management',
  templateUrl: './end-user-management.component.html',
  styleUrls: ['./end-user-management.component.scss']
})
export class EndUserManagementComponent implements OnInit {
  @Input() model: EndUserView;
  @Input() payloadmodel: EndUserPayLoad;
  //@Input('listModel') listModel: any;
  //listModel : EndUserView[] = [];
  //listModel:any;

  page = 1;
  currentpage: any;
  pageOfItems: any[];
  searchValue: DataLoadParams;
  viewModel: any;
  RacfId: any;
  type: string;
  documentUrl: string;
  selectedMessage: any;
  minValue: number = 50;
  maxValue: number = 200;
  options: Options = {
    floor: 0,
    ceil: 250
  };
  loading = false;
  listModel: EndUserView[] = [];
  // listModel:any;
  selectedModel: EndUserView;
  selectedImage: string;
  showFeedbackModal = false;
  showImageModal = false;
  showShareModal = false;
  carouselBusPhoto = [];
  bannerImg = [];
  responsiveOptions;
  showCarousel = true;
  documentFormArray: Array<any> = [];
  totalCount:any;
  currentIndex: number = -1;
  showFlag: boolean = false;
  permissionView: any;
  permissionDownload: any;
  user = this.userService.getUserRoleId();
  listImageSelect: Array<EndUserView>;

  userManual:any;
  pdfView:any;
  errMsg = false;
  displayStyle = "none";
  dashBoardAccess: any;
  searchedValue:boolean = false;
  userToken: string;
  constructor(
    private cdr: ChangeDetectorRef,
    private alertService: AlertsService,
    public service: EndUserService,
    private intcompservice: IndependentcomponentserviceService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private bannerService: BannerService,
    private rolepermission: RolePermissionService,
    public translate:TranslateService,
    private sanitizer: DomSanitizer,
    private masterservice:MasterDataService,

    // public safeSrc: SafeResourceUrl
  ) {
    //this.listModel =localStorage.getItem('enduserlistModel');
    //this.intcompservice.currentMessage.subscribe(message => (this.selectedMessage= message));
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];


  }

  async ngOnInit() {
    this.loading = true;
    this.checkPermission().then(x => {
    });

    let appliedLang = localStorage.getItem('Applylanguage')
    let preLang = localStorage.getItem('preLanguage')
    if(appliedLang){
      this.translate.use(appliedLang);
    }
    else if(preLang){
      this.translate.use(preLang);
    }
    this.service.showFilter = true;
    this.service.downloadFilter = false;
    this.service.menuFilter = true;
    this.service.showFilter = true;
    this.service.showMenu = true;
    this.service.showOrder = false;
    this.service.userRole = true;
    // console.log('search')
    this.userToken = this.userService.getRacfId();
      this.masterservice.getLanguage(this.userToken);
    this.intcompservice.currentMessage.subscribe(async message => {
      if(message.documentCategoryId == null){

        let id = localStorage.getItem('menu ID')
        console.log(id);
        message.documentCategoryId = id;
        console.log('message', this.intcompservice.model)

      }
      if (message.length == 0) {
        if (this.intcompservice.model) {
          // console.log("sd");
          this.intcompservice.changeMessage(this.intcompservice.model)
        }
        return;
      }
      else if (message.documentSortId) {

        localStorage.setItem('sortby', 'true')
      }
      let resultValue = localStorage.getItem("sortby")
      let searchData = '';
      let page = JSON.parse(localStorage.getItem('page'));
      let localSearch = localStorage.getItem('searchData');
      if(localSearch == null){
        message.documentSearch = '';
      }
      if(page){
        this.page = page;
      }
      else if (resultValue) {
        this.page = 1;
        if(localSearch != null){
          searchData = localSearch;
        }
        else{
          console.log('localdtaa')
          searchData = message.documentSearch
        }
      }
      if(message.documentSearch){
        this.page = 1;
        if(localSearch){
          searchData = localSearch;
        }
        else{
          console.log('localdtaa',message)
          searchData = message.documentSearch
        }
      }
      else if(localSearch){
        searchData = localSearch;
        this.page = 1;
      }
      else{
        this.page = 1;
        // 
      }
      let params: any = {
        page: this.page,
        size: 12,
        sort: 'desc',
        searchKey: searchData
      }
      console.log('else',searchData)
      if(searchData){
        this.searchedValue = true;
      }
      else{
        this.searchedValue = false;
      }
    this.RacfId = this.userService.getRacfId();
    console.log("pmg",message)
    const bannerImagesRes= await this.service.getAllBanner(message,this.RacfId);
    const res = await this.service.getAll(params, message);
      
    if(res && res.data && res.data.content){
      this.totalCount = res.data.totalElements;
    this.listModel = await Promise.all(res?.data?.content?.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
    //.loadDoc();
    
    this.loading = false;
  }
    else if (res.data == null){
      this.loading = false;
    }
    // console.log('ThisLoading',this.listModel);
    // this.handlePageChange(1);
    this.RacfId = this.userService.getRacfId();
    this.carouselBusPhoto.length = 0;
    this.showCarousel = false;
    try{
      if (message.documentSortId) {
        localStorage.removeItem('sortby')
      }
      // const bannerImagesRes= await this.service.getAllBanner(message,this.RacfId);
      if(bannerImagesRes && bannerImagesRes.data!=null){
        this.bannerImg = [];
        let filterdList : any [] = bannerImagesRes.data.bannerImageList.filter(val=> val.activeFlag == 1) 
        if(filterdList[0].activeFlag == 1){
        filterdList.forEach(element => {

            if (element.imageUrl != null && element.activeFlag == 1) {
              this.bannerImg.push(element.imageUrl)
            }
            // else{
            // this.bannerImg.push("../../../../assets/icons/F142824142.png")
            // }
          });
          this.carouselBusPhoto = this.bannerImg;
          // console.log("bannerList", this.carouselBusPhoto)
          this.showCarousel = true;
        }else {
          this.bannerImg = [];
          this.bannerImg.push("../../../../assets/icons/F142824142.png")
          this.carouselBusPhoto = this.bannerImg;
          this.showCarousel = true;
        }
        }else{
          this.carouselBusPhoto = [
            '../../../../assets/icons/F142824142.png',
          ];
          this.showCarousel = true;
        }
        // console.log(this.bannerImg);
      } catch (error) {
        this.carouselBusPhoto = [
          '../../../../assets/icons/F142824142.png',
        ];
        this.showCarousel = true;
      }
    });

  }

  // loadDoc(){
  //   this.listModel.forEach((element,index) => {
  //     this.type = this.checkURL(element.documentFileName);
  //   //.log(this.documentDetails[0])
  //   this.documentUrl = element.imgSrc;
  //   })
  //   console.log(this.type);
  //   // this.modalHeight = window.innerHeight*0.90;
  // }
  // checkURL(url: string) {
  //   console.log(url);
  //   if((url.match(/\.(jpeg|jpg|gif|png)$/gi) != null)){
  //     return 'image';
  //   }else if(url.match(/\.(mp4)$/gi) != null){
  //     return 'video';
  //   }else if(url.match(/\.(mp3)$/gi) != null){
  //     return 'audio';
  //   }
  // }
  // selectedSRC: any;
  // embede='&embedded=true';
  async checkPermission() {
    await this.rolepermission.getPermissionForModule(this.user, "Dealer View");
    this.permissionView = await this.rolepermission.getRoleById("view_access");
    this.permissionDownload = await this.rolepermission.getRoleById("download_access");

    this.dashBoardAccess = localStorage.getItem('USERACCESSINFO');
    if(localStorage.getItem('userGuide') == 'true'){
      this.errMsg = false;
      this.displayStyle = "none";
    }else{
      if(this.dashBoardAccess == 'Dealer' || this.dashBoardAccess == 'John Deere Employee' || this.dashBoardAccess == 'Vendor'){
       this.userManual = await this.service.getUserManual();
      this.pdfView = this.sanitizer.bypassSecurityTrustResourceUrl(this.userManual.data.fileUrl+"#toolbar=0&navpanes=0&scrollbar=0")
        this.errMsg = true;
        this.displayStyle = "block";
      }
    }
  }
  closeModal(){
    localStorage.setItem('userGuide','true');
    this.errMsg = false;
    this.displayStyle = "none";
  }

  handlePageChange(event) {
    this.page = event;
    // console.log(this.page)
    localStorage.setItem('page',JSON.stringify(this.page))
    let localSearch = localStorage.getItem('searchData');
    this.intcompservice.currentMessage.subscribe(async message => {
      if (message.length == 0) {
        if (this.intcompservice.model) {
          // console.log("sd");
          this.intcompservice.changeMessage(this.intcompservice.model)
        }
        return;
      }
      let params: any = {
        page: this.page,
        size: 12,
        sort: 'desc',
        searchKey: localSearch
      }
      const res = await this.service.getAll(params, message);
      if (res && res.data && res.data.content){
        this.totalCount = res.data.totalElements;
      this.listModel = await Promise.all(res?.data?.content?.map((x: any) => EndUserModelMapper.mapToViewModel(x, null)));
      //.loadDoc();
      this.loading = false;
    }
    else if (res.data == null){
      this.loading = false;
    }
      // console.log(this.listModel);
      // this.handlePageChange(1);
      // this.RacfId = this.userService.getRacfId();
      // this.carouselBusPhoto.length = 0;
      // this.showCarousel = false;

      // try {

      //   const bannerImagesRes = await this.service.getAllBanner(message, this.RacfId);
      //   if (bannerImagesRes && bannerImagesRes.data) {
      //     this.bannerImg = [];
      //     bannerImagesRes.data.bannerImageList.forEach(element => {

      //       if (element.imageUrl != null && element.activeFlag == 1) {
      //         this.bannerImg.push(element.imageUrl)
      //       }
      //       // else{
      //       // this.bannerImg.push("../../../../assets/icons/F142824142.png")
      //       // }
      //     });
      //     this.carouselBusPhoto = this.bannerImg;
      //     // console.log("bannerList", this.carouselBusPhoto)
      //     this.showCarousel = true;
      //   } else {
      //     this.carouselBusPhoto = [
      //       '../../../../assets/icons/F142824142.png',
      //     ];
      //     this.showCarousel = true;
      //   }
      //   // console.log(this.bannerImg);
      // } catch (error) {
      //   this.carouselBusPhoto = [
      //     '../../../../assets/icons/F142824142.png',
      //   ];
      //   this.showCarousel = true;
      // }
    });
  }

  sortChange(val:any)
  {

  }

  goToDetailedScreen(selectedModel: any) {
    this.router.navigate(['/master/detailed-view/' + selectedModel?.documentId + '/' + selectedModel?.documentFileId]);
  }


  // async endUserListLoad(listItem:any)
  // {

  //   const res = await this.service.getAll(null,null);
  //   this.listModel = await Promise.all(res.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null)));
  // }

  async showFeedback(event: any, selectedModel: any) {


    // const result = await this.service.getFeedback(selectedModel.documentFileId,this.RacfId);
    this.selectedModel = selectedModel;
    if(this.selectedModel.feedBack != null){
      this.selectedModel.feedBack = '';
    }

    // if(result.data){
    //   this.selectedModel.feedBack = result.data.feedBack;
    // }
    this.showFeedbackModal = true;
  }

  showImage(url: string) {
    this.selectedImage = url;
    this.showImageModal = true;
  }

  showShare(event: any, selectedModel: any) {
    this.showShareModal = true;
    this.selectedModel = selectedModel;
  }
  onCloseImageModal(e: any) {
    this.showImageModal = false;
  }
  onCloseAddModal(e: any) {
    this.showFeedbackModal = false;
  }
  onCloseShareModel(e: any) {
    this.showShareModal = false;
  }
  async addToCart(documentID: any, documentFileId: any, productFlag: any) {
    const result = await this.service.addtoCart(documentID, this.RacfId, documentFileId, productFlag);
    if (ApiErrorUtil.isError(result)) {
      console.log('data',result)

      // this.alertService.show("Status Updated Successfully",AlertType.Success);
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.ITEMALREADYEXITS,AlertType.Critical);
       });
    } else {
      if (result?.message?.messageDescription.length) {
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.ITEMADDEDCART);
         });
        // this.alertService.show(result?.message?.messageDescription);
        
      }

      else {
        this.alertService.show("Status Updated Successfully");
        this.service.CountChangeDetected = true;
      }
      this.service.CountChangeDetected = true;
      //this.onClose();
    }
    // setTimeout(() => {
    //   window.location.href = '/master/end-user-management';
    // }, 3000);
  }

  async addWishlist(id: any, isWishlist: number, documentFileId: number, productFlag: number,hasDownloadAccess:boolean) {
    let result;

    if(hasDownloadAccess == true){
    if (isWishlist) {
      this.loading = true;
      result = await this.service.removeWishlist(id, this.RacfId);

    } else {
      this.loading = true;
      result = await this.service.addWishlist(id, this.RacfId, documentFileId, productFlag);
      var wishlistID = this.listModel.find(x => x.documentFileId == documentFileId);
      wishlistID.wishlistId = result.data.wishListId;
    }
    console.log('itemfdsfdsf',result)
    }else{
      this.alertService.show("You don't have access to this document. Kindly contact the Administrator to get the access",AlertType.Warning)
    }
    //this.ngOnInit()
    if (ApiErrorUtil.isError(result)) {
      console.log('item',result)
      this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.ITEMREMOVED,AlertType.Critical);
         });
     
    } else {

      var temp = this.listModel.find(x => x.documentFileId == documentFileId);
      temp.wishList = !isWishlist ? true : false;
      //this.ngOnInit()
      //setTimeout(() => {this.ngOnInit() = true;}, 200);


      try {
        // this.cdr.detectChanges()
      }
      catch (e) {
        // console.log(e)
      }

      if (result?.message?.messageDescription.length)
      {
        // this.alertService.show(result?.message?.messageDescription);
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
        this.alertService.show("Status Updated Successfully");
      //this.onClose();
      this.loading = false;
    }
    // setTimeout(() => {
    //   window.location.href = '/master/end-user-management';
    // }, 3000);
    this.service.CountChangeDetected = true;
  }

  async downloadDocument(documentFile:any,documentID:any,documentFileId:any,productFlag:number,downloadUrl: any,downloadFlag:any){
    
    // console.log('down',downloadFlag)
    if(downloadFlag == 'direct'){
      const imgUrl = downloadUrl;
      const imgName = documentFile;
      const a = document.createElement('a');
      a.href = await this.toDataURL(imgUrl);
      a.download = imgName;
      document.body.appendChild(a);
      a.click();
      this.downloadcall(documentFile, documentID, documentFileId, productFlag)
      document.body.removeChild(a);
    }
  
    // if(downloadFlag == 'direct'){
    //   const imgUrl = downloadUrl;
    //   const imgName = documentFile;
    //   this.http
    //     .get(imgUrl, { responseType: "blob" as "json" })
    //     .subscribe((res: any) => {
    //       console.log("res",res)
    //       try {
    //         const file = new Blob([res], { type: res.type });
    //         const blob = window.URL.createObjectURL(file);
    //         const link = document.createElement("a");
    //         link.href = blob;
    //         link.download = imgName;
    //         this.downloadcall(documentFile, documentID, documentFileId, productFlag)
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
    //         console.log("error")
    //       }
    //       // IE
    //       // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //       //   window.navigator.msSaveOrOpenBlob(file);
    //       //   return;
    //       // }
    //     });
    // }
    else{
const url = await this.service.downloadFile(documentFile);
    this.documentFormArray.length = 0;
    var result1;
    if(productFlag == 1){
      this.documentFormArray.push({'documentId':documentID,'racfId':this.RacfId,'documentFileId':documentFileId,'quantity':1,'productFlag':1})
      result1=await this.service.placeOrder(this.documentFormArray);
    }
    else if(productFlag == 0){
      this.documentFormArray.push({'documentId':documentID,'racfId':this.RacfId,'documentFileId':documentFileId,'quantity':1,'productFlag':0})

    }
    // this.documentFormArray.push({'documentId':documentID,'racfId':this.RacfId,'documentFileId':documentFileId,'quantity':1,'productFlag':0})
    result1=await this.service.placeDownloadOrder(this.documentFormArray);
    if(result1.message){
      this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    }
    DownloadUtil.downloadFile(this.http, url, documentFile , 'img_download');
    }
   

  }

  toDataURL(url) {
    // console.log("url",url)
    this.translate.get('HOME').subscribe((data:any)=> {
      this.alertService.show(data.FILEDOWNLOADSTART,AlertType.Warning);
     });
    // this.alertService.show("File downloading process started successfully.Please check after some time in your browser download section.",AlertType.Warning);
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
        this.alertService.show(data.FILEDOWNLOAD);
       });
      // this.alertService.show("File downloaded successfully.");
    }
    this.service.CountChangeDetected = true;
  }

  downloadFile(url: string) {
    const mapForm = document.createElement('form');
    mapForm.target = '_self' || '_blank';
    mapForm.id = 'stmtForm';
    mapForm.method = 'POST';
    mapForm.action = url;

    const mapInput = document.createElement('input');
    mapInput.type = 'hidden';
    mapInput.name = 'Data';
    mapForm.appendChild(mapInput);
    document.body.appendChild(mapForm);
    mapForm.submit();
  }

  showLightbox(index) {
    this.currentIndex = index;
    // this.listImageSelect = [this.listModel[this.currentIndex + ((this.page - 1) * 12)]];
    this.listImageSelect = [this.listModel[this.currentIndex]];
    // console.log(this.listImageSelect)
    if (String(this.listImageSelect[0].extension).toLowerCase() != 'pdf') {
      this.showFlag = true;

    }
    else {
      localStorage.removeItem('page');
      localStorage.removeItem('sortById');
      localStorage.removeItem('language');
      localStorage.removeItem('fileType');
    localStorage.removeItem('searchData');

      window.open('master/pdf-view-full/' + this.listImageSelect[0].documentId + '/' + this.listImageSelect[0].documentFileId, '_blank');
    }
    // this.currentIndex = index;

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
}
