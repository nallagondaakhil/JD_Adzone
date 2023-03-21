import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';
import { AlertsService, AlertType } from 'src/app/shared/services/alerts.service';
import { ModalDialogService, ModalType } from 'src/app/shared/services/modal-dialog.service';
import { ApiErrorUtil } from 'src/app/shared/utils/api-error.util';
import { BannerMasterModel } from '../../../models/banner-master.model';
import { BannerService } from '../../../services/banner.service';
import { BannerModelMapper, BannerViewModel } from '../../models/banner-view.model';

@Component({
  selector: 'jd-add-edit-banner',
  templateUrl: './add-edit-banner.component.html',
  styleUrls: ['./add-edit-banner.component.scss']
})
export class AddEditBannerComponent implements OnInit {
  @Output() closed = new EventEmitter();
  @Output() bannerPreview = new EventEmitter();
  @Input() model: BannerViewModel;
  @Input() category_Id : any;
  bannerDocFn: any;
  // bannerDocFn2: any;
  // bannerDocFn3: any;
  // bannerDocFn4: any;
  // bannerDocFn5: any;
  loading = false;
  showPreview = false;
  uploadPopup= true;
  bannerDocs: Array<{fileName: string, fileUrl: string, bannerId:number}[]> = [
    [],[],[],[],[]
  ];
  isEdit: boolean;
  count: number;
  racfId:any;
  remainingCount: number[] = [];
  listModel : BannerViewModel[] = [{},{},{},{},{}] ;
  constructor(
    private service: BannerService,
    private alertService: AlertsService,
    private modalService: ModalDialogService,
    private userService:UserService,
  ) { 
    this.bannerDocFn = this.service.uploadFile1.bind(this.service);
  }
  fileUplodeExtention = ['jpg', 'jpeg', 'png'];
  ngOnInit(): void {
    // this.isEdit = this.model ? true : false;
    // this.model = this.model || {} as any;
    
    this.initializeData().then(x => { });
    
  }

  async initializeData() {
    this.service.categoryId = this.model.id;
    this.racfId = this.userService.getRacfId();
    // this.listModel = await this.service.getAll(this.model);
    const res=await this.service.getAll(this.model,this.racfId);
    if(res.data){
      let bannerList:any = await Promise.all(res.data?.bannerImageList.map((x: any) => BannerModelMapper.bannerList(x)));
      console.log(bannerList)
      bannerList.forEach(element => {
        console.log(element.imageNo)
        this.listModel[element.imageNo - 1] = element;
      })
      console.log(this.listModel)
      this.isEdit = true
    }
    else{
      this.isEdit = false;
      this.listModel = [
        {activeFlag: 0,bannerId: null,createdDate: null,deleteFlag: 0,documentCategoryId: undefined,imageNo: 0,imageName:null,imageUrl:null},
        {activeFlag: 0,bannerId: null,createdDate: null,deleteFlag: 0,documentCategoryId: undefined,imageNo: 0,imageName:null,imageUrl:null},
        {activeFlag: 0,bannerId: null,createdDate: null,deleteFlag: 0,documentCategoryId: undefined,imageNo: 0,imageName:null,imageUrl:null},
        {activeFlag: 0,bannerId: null,createdDate: null,deleteFlag: 0,documentCategoryId: undefined,imageNo: 0,imageName:null,imageUrl:null},
        {activeFlag: 0,bannerId: null,createdDate: null,deleteFlag: 0,documentCategoryId: undefined,imageNo: 0,imageName:null,imageUrl:null}]
    }
    // if(this.isEdit){
    //   this.count = 5-this.listModel.length // 4
    //   for(let i=1 ; i<=this.count; i++){
    //     this.remainingCount.push(this.listModel.length+i)
    //   }
      
    // }else{
    //   this.count = 5;
    //   for(let i=1 ; i<=this.count; i++){
    //     this.remainingCount.push(i)
    //   }
    // }
    if(this.isEdit){
      this.listModel.forEach((element,index) => {
        if(element.fileName)
        this.bannerDocs[index] = [{fileName: element.fileName, fileUrl: element.fileUrl,bannerId:element.bannerId}]
        console.log(element.bannerId)
      });
    }
    console.log(this.listModel)
  }

  changeStatus(model:BannerViewModel){
    if(model.activeFlag === 1){
      this.showConfirmation('Inactive', model);
    }else if(model.activeFlag === 0){
      this.showConfirmation('Active', model);
    }
  }

  showConfirmation(status: string, model: BannerViewModel) {
    this.modalService.show({
      title: status === 'Active' ? 'Activate Banner' : 'Deactivate Banner',
      message: `Are you sure you want to ${status === 'Active' ? 'Activate' : 'Deactivate'} this Banner?`,
      okText: 'Yes',
      okCallback: async () => {
        this.loading = true;
        try {
          let result: ApiResponse<BannerMasterModel>;
          if (status === 'Active') {
            result = await this.service.activate(model.bannerId,model.imageNo);
          } else {
            result = await this.service.deactivate(model.bannerId,model.imageNo);
          }
          if (ApiErrorUtil.isError(result)) {
            this.alertService.show(ApiErrorUtil.errorMessage(result), AlertType.Critical);
          } else {
            this.alertService.show(result?.message?.messageDescription );
          }
        } catch (error) {
          if(this.isEdit){
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to update status.', AlertType.Critical);

          }else{
            this.alertService.show(ApiErrorUtil.errorMessage(error) || 'Failed to add status.', AlertType.Critical);

          }
        }
        this.loading = false;
        this.modalService.publisher.next(null);
        this.initializeData();
      },
      cancelText: 'No',
      cancelCallback: () => {
        this.modalService.publisher.next(null);
      },
      modalType: ModalType.warning,
      isSecondModal: false
    });
  }
  onPreview(){
    this.category_Id = this.model.id;
    if(this.model.id){
      this.showPreview = true;
      this.uploadPopup = false;
      this.bannerPreview.emit()
    }
    else{
      this.alertService.show("File is required.", AlertType.Critical);
    }
    console.log(this.model)
  }
  onClose(){
    this.closed.emit();
  }

  onUpload(files: {fileName: string, fileUrl: string}[], type: string, id:number) {
    files = files || [];
    console.log(files)
    if(files.length == 0)
    this.listModel[id-1] = {};
    else{
      this.listModel[id-1].imageName = files[0].fileName;
    }
    // this.initializeData()
    switch(id) {
      case 1:
        // this.model.file1Name = files && files[0]?.fileName || null;
        // this.model.file1Url = files && files[0]?.fileUrl || null;
        // this.bannerDocs[0]=[{fileName: this.model.file1Name, fileUrl: this.model.file1Url,bannerId:this.model.bannerId}]
       
        break;
      case 2:
        // this.model.file2Name = files && files[0]?.fileName || null;
        // this.model.file2Url = files && files[0]?.fileUrl || null;
        // this.bannerDocs[1]=[{fileName: this.model.file1Name, fileUrl: this.model.file1Url,bannerId:this.model.bannerId}]
        break;
      case 3:
        // this.model.file3Name = files && files[0]?.fileName || null;
        // this.model.file3Url = files && files[0]?.fileUrl || null;
        // this.bannerDocs[2]=[{fileName: this.model.file1Name, fileUrl: this.model.file1Url,bannerId:this.model.bannerId}]
        break;
      case 4:
        // this.model.file4Name = files && files[0]?.fileName || null;
        // this.model.file4Url = files && files[0]?.fileUrl || null;
        // this.bannerDocs[3]=[{fileName: this.model.file1Name, fileUrl: this.model.file1Url,bannerId:this.model.bannerId}]
        break;
      case 5:
        // this.model.file5Name = files && files[0]?.fileName || null;
        // this.model.file5Url = files && files[0]?.fileUrl || null;
        // this.bannerDocs[4]=[{fileName: this.model.file1Name, fileUrl: this.model.file1Url,bannerId:this.model.bannerId}]
        break;
    }
    this.initializeData();
    
    }
  }
