import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { DownloadUtil } from 'src/app/shared/utils/download-util';
import { EndUserService } from '../../../services/end-user.service';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { DomSanitizer } from '@angular/platform-browser';
import { RolePermissionService } from '../../../services/role-permission.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'jd-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss']
})
export class DetailedViewComponent implements OnInit {
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  currentDocId : number;
  currentDocFileId:number;
  documentDetails : any;
  releaseDate: string;
  RacfId:any;
  documentFormArray: Array<any> = [];
  type: string;
  timeIntervalFrame:any;
  loading: Boolean = false;
  documentUrl: string;
  documentFileSize:string;
  currentIndex: number = -1;
  showFlag:boolean = false;
  showloder=false;
  permissionView:any;
  permissionDownload:any;
  downloadAccess:any;
  detailsDaata:any;
  user = this.userService.getUserRoleId();
  // listImageSelect=[];
  imageObject=[{image:'',
              thumbImage:''}];
              base64="";
            pdfSrc = "";
  constructor(
    private service: EndUserService,
    private router: Router,
    private userService:UserService,
    private alertService: AlertsService,
    private http: HttpClient,
    private cdr:ChangeDetectorRef,private sanitizer: DomSanitizer,
    private rolepermission:RolePermissionService,
    public translate:TranslateService
  ) { }

  async ngOnInit(): Promise<void> {
    this.checkPermission().then(x => {
    });
    var pathArray = window.location.pathname.split('/');
    this.currentDocId = Number(pathArray[3]);
    this.currentDocFileId = Number(pathArray[4]);
    this.RacfId = this.userService.getRacfId();
    this.detailsDaata = await this.service.getDetailsWithId(this.currentDocId,this.currentDocFileId,this.RacfId);
    if (this.detailsDaata.data == null) {
      this.alertService.show(this.detailsDaata.error.errorMessage, AlertType.Info);
    } else {
      this.documentDetails = this.detailsDaata.data.content;
      this.downloadAccess = this.documentDetails[0].hasDownloadAccess;
      this.documentFileSize = this.formatBytes(this.documentDetails[0]?.documentFileSize)
      // this.releaseDate =this.formatDate(this.documentDetails[0].documentUpdatedDate == null ?  this.documentDetails[0]?.documentCreatedDate : this.documentDetails[0]?.documentUpdatedDate);
      this.releaseDate = this.formatDate(this.documentDetails[0]?.documentCreatedDate);
      this.loadDoc();
      this.service.showFilter = false;
      this.service.showMenu = false;
      this.service.showOrder = false;
      this.service.downloadFilter = false;
      this.service.userRole = true;
      this.cdr.detectChanges()
    }
  }
  async checkPermission(){
    await this.rolepermission.getPermissionForModule(this.user,"Dealer View");
    this.permissionView = await this.rolepermission.getRoleById("view_access");
    this.permissionDownload = await this.rolepermission.getRoleById("download_access");

   
  }

  loadDoc(){
    this.type =this.checkURL(this.documentDetails[0].documentFileName);

    this.documentUrl = this.documentDetails[0].thumbnailUrl;
    // console.log(this.documentDetails[0].base64)

    // this.modalHeight = window.innerHeight*0.90;
    this.imageObject[0].image=this.documentUrl;
    this.imageObject[0].thumbImage=this.documentUrl;
  }
 async loadPFBase4()
 {
  try{
  const res:any = await this.service.getPdfBase64(this.currentDocId,this.currentDocFileId);
  // console.log(res);
  this.base64 =res.data.content[0].base64;
  this.printPdf()
  }
  catch(e)
  {

  }
  this.showloder=false;
  //this.loading = false;
 }
  checkURL(url: string) {
    if((url.match(/\.(jpeg|svg|bmp|jpg|gif|png|tif|tiff|webp)$/gi) != null)){
      return 'image';
    }else if(url.match(/\.(pdf)$/gi) != null){
     // this.loading = true;
     this.showloder = true;
      this.loadPFBase4()

      return 'pdf';
    }else if(url.match(/\.(xls|doc|docx|ppt|pptx)$/gi) != null){

      this.isDocLoaded()
      return 'doc';
    }else if(url?.match(/\.(xlsx)$/gi) != null){
      return 'xlsx';
    }
    else if(url.match(/\.(mp4)$/gi) != null){
      return 'video';
    }else if(url?.match(/\.(mov)$/gi) != null){
      return 'video';
    }else if(url?.match(/\.(avi)$/gi) != null){
      return 'video';
    }else if(url?.match(/\.(ogg)$/gi) != null){
      return 'audio';
    }else if(url?.match(/\.(wmv)$/gi) != null){
      return 'video';
    }else if(url?.match(/\.(webm)$/gi) != null){
      return 'video';
    }else if(url?.match(/\.(mkv)$/gi) != null){
      return 'video';
    }
    else if(url.match(/\.(mp3)$/gi) != null){
      return 'audio';
    }else if(url?.match(/\.(ai)$/gi) != null){
      return 'ai';
    }else if(url?.match(/\.(psd)$/gi) != null){
        return 'psd';
    }else if(url?.match(/\.(cdr)$/gi) != null){
        return 'cdr';
    }else if(url?.match(/\.(indt)$/gi) != null){
      return 'indt';
    }else if(url?.match(/\.(inx)$/gi) != null){
        return 'inx';
    }else if(url?.match(/\.(indb)$/gi) != null){
        return 'indb';
    }else if(url?.match(/\.(indl)$/gi) != null){
        return 'indl';
    }else if(url?.match(/\.(indd)$/gi) != null){
        return 'indd';
    }
  }

  isDocLoaded(){
    var that = this;
    this.timeIntervalFrame = setInterval(() => {
        var el = document.getElementById('iframe-doc-viewer');

        if(el){
          clearInterval(that.timeIntervalFrame);
              that.loading = false;
            el.addEventListener('load', function(){

                // console.log("Load event: Iframe doc loaded.");

                el.addEventListener('load', function(){ console.log("Load event: Iframe doc loaded."); }, true);
            }, false);
        }
    }, (1000));
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  formatBytes(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let l = 0, n = parseInt(x, 10) || 0;
        while(n >= 1024 && ++l){
            n = n/1024;
        }
     return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

  goBack(){
    //window.location.href = '/master/end-user-management';
     this.service.showMenu=true;
     this.service.showOrder=false;
    //  this.router.navigate(['/master/end-user-management']);
      window.location.href ='/master/end-user-management'
    }
  async addToCart(documentID:any,documentFileId:any,productFlag:any){

    const result=await this.service.addtoCart(documentID,this.RacfId,documentFileId,productFlag);
    this.documentFormArray.push({'documentId':documentID,'racfId':this.RacfId,'documentFileId':documentFileId})
    //const result1=await this.service.placeOrder(this.documentFormArray);
    if (ApiErrorUtil.isError(result)) {
      // console.log("ITEMALREADYEXITS")
        if(result.error.errorMessage == 'Item already exist'){
          this.translate.get('HOME').subscribe((data:any)=> {
            this.alertService.show(data.ITEMALREADYEXITS,AlertType.Critical);
           });
        }
      // this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
    } else {
      this.service.CountChangeDetected =true;
      if(result?.message?.messageDescription.length)
      {
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.ITEMADDEDCART);
         });
        // this.alertService.show(result?.message?.messageDescription );
        this.service.CountChangeDetected =true;
      }

      else
      {
        this.service.CountChangeDetected =true;
        
        this.translate.get('HOME').subscribe((data:any)=> {
          this.alertService.show(data.STATUSUPDATEDSUCCESSFULLY);
         });
        // this.alertService.show("Status Updated Successfully");
      }

      //this.onClose();
    }
    // setTimeout(() => {
    //   window.location.reload();
    // }, 3000);
  }
  async downloadDocument(documentFile:any,documentID:any,documentFileId:any,productFlag:number,downloadUrl:any,downloadFlag:any){
    if(downloadFlag == 'direct'){
      const imgUrl = downloadUrl;
      const imgName = documentFile;
      const a = document.createElement('a');
      a.href = await this.toDataURL(imgUrl);
      a.download = imgName;
      document.body.appendChild(a);
      a.click();
      this.downloadcall(documentFile, documentID, documentFileId,productFlag)
      document.body.removeChild(a);
    }
    // const url = await this.service.downloadFile(documentFile);
    // this.alertService.show("File downloading process started successfully.Please check after some time in your browser download section.",AlertType.Warning);
    // this.documentFormArray.push({'documentId':documentID,'racfId':this.RacfId,'documentFileId':documentFileId,'productFlag':0})
    // const result1=await this.service.placeDownloadOrder(this.documentFormArray);
    // this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
    // DownloadUtil.downloadFile(this.http, url, documentFile , 'img_download');
    else{
          const url = await this.service.downloadFile(documentFile);
          this.documentFormArray.length = 0;
          var result1;
          result1=await this.service.placeDownloadOrder(this.documentFormArray);
          if(result1.message){
            this.translate.get('HOME').subscribe((data:any)=> {
              this.alertService.show(data.FILEDOWNLOAD);
             });
            // this.alertService.show("File downloaded successfully. Please check after some time in your browser download section.");
          }
          DownloadUtil.downloadFile(this.http, url, documentFile , 'img_download');
          }
  }

  toDataURL(url) {
    // console.log("url",url)
    this.translate.get('HOME').subscribe((data:any)=> {
      this.alertService.show(data.FILEDOWNLOADSTART);
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
    this.documentFormArray.push({ 'documentId': documentID, 'racfId': this.RacfId, 'documentFileId': documentFileId, 'quantity': 1, 'productFlag': 0})
    result1 = await this.service.placeDownloadOrder(this.documentFormArray);
    if (result1.message) {
      this.translate.get('HOME').subscribe((data:any)=> {
        this.alertService.show(data.FILEDOWNLOAD);
       });
      // this.alertService.show("File downloaded successfully.");
    }
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
  this.showFlag = true;
  // this.listImageSelect=[this.imageObject];
  // console.log(this.listImageSelect)
  // console.log(index);
}

closeEventHandler() {
  this.showFlag = false;
  this.currentIndex = -1;
}
printPdf() {

  //let json: any =  { "type":"Buffer", "data":this.blob }
  //let bufferOriginal = Buffer.from(json.data);
  const byteArray = new Uint8Array(
    atob(this.base64)
      .split("")
      .map(char => char.charCodeAt(0))
  );
  const file= new Blob([byteArray], { type: "application/pdf" });
  var fileURL :any  = URL.createObjectURL(file);
  this.pdfSrc = fileURL;
  // console.log(fileURL);
  // var test: any =this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
 // fileURL = this.convert(this.base64);
  // console.log(fileURL)
  // document.getElementById('test').setAttribute("src", fileURL)
  document.getElementById('link').setAttribute("href", fileURL );

  //window.open(fileURL);
}
transform(url) {

  return this.sanitizer.bypassSecurityTrustUrl(url);

}
async convert(base64Data)  {
  const r = await fetch(base64Data);
  const blob = await r.blob();
  return blob
}
}
