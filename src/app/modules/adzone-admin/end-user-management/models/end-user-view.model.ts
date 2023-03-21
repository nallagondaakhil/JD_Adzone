import { IfStmt } from "@angular/compiler";
import { UserService } from "src/app/core/services/user.service";
import { CurrencyInputComponent } from "src/app/shared/components/currency-input/currency-input.component";
import { environment } from "src/environments/environment";
import { EndUserMasterModel } from "../../models/end-user-master.model";
import { EndUserService } from "../../services/end-user.service";

export class EndUserView {
    // activateFlag?: string;
    // createdBy?: string;
    documentCreatedDate?: string;
    createdDate?: string;
    deleteFlag?: number;
    documentCategoryId?: number;
    documentCategoryName?: string;
    documentId?: number;
    documentName?: string;
    hasDownloadAccess?:boolean;
    documentSubCategoryId?: number;
    documentSubCategoryName?: string;
    documentSubChildCategoryId?: number;
    documentSubChildFourthCategoryId?: number;
    documentSubChildFourthCategoryName?: string;
    documentSubChildCategoryName?: string;
    // updatedBy?: string;
    documentUpdatedDate?: string;
    documentFileName?: string;
    documentFileSize?:string;
    documentFileType?:string;
    language?:string;
    extension?:string;
    imgSrc?:string;
    wishList?:boolean;
    feedBack?:string;
    releaseDate?: string;
    shareUrl?:string;
    thumbnailUrl?:string;
    image?:string;
    orderId?:number;
    orderNumber?:number;
    orderOn?:string;
    quantity?:string;
    deliveredOn?:string;
    orderAmount?:string;
    orderStatus?:string;
    isChecked?:boolean;
    userCartId?:number;
    productFlag?:number;
    count?:number;
    documentFileId?:number;
    wishlistId?:number;
    currency?:string;
    price?:string;
    extensionType?:string;
    totalOrderPrice?:number;
    productPrice?:number;
    expiryDate?: string;
    isLoaded?:boolean;
    downloadUrl?:string;
    downloadFlag?:string;
    checked:number;
}



export class EndUserModelMapper {
    static async mapToViewModel(model: EndUserMasterModel, service: EndUserService,data?:any): Promise<EndUserView> {
        // console.log('model',model)
    var releaseDate =formatDate(model?.documentUpdatedDate == null ?  model?.documentCreatedDate : model?.documentUpdatedDate);
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('-');
        }
        function checkURL(url) {
            if((url?.match(/\.(jpeg|svg|bmp|jpg|gif|png|pdf|tiff|tif|webp)$/gi) != null)){
              return 'image';
            }else if(url?.match(/\.(mp4)$/gi) != null){
              return 'video';
            }
            else if(url?.match(/\.(mov)$/gi) != null){
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
            else if(url?.match(/\.(mp3)$/gi) != null){
              return 'audio';
            }else if(url?.match(/\.(ai)$/gi) != null){
                return 'ai';
            }else if(url?.match(/\.(psd)$/gi) != null){
                return 'psd';
            }else if(url?.match(/\.(cdr)$/gi) != null){
                return 'cdr';
            }else if(url?.match(/\.(zip)$/gi) != null){
                return 'zip';
            }else if(url?.match(/\.(psp)$/gi) != null){
                return 'psp';
            }else if(url?.match(/\.(psb)$/gi) != null){
                return 'psb';
            }else if(url?.match(/\.(xlsx)$/gi) != null){
                return 'xlsx';
            }else if(url?.match(/\.(docx)$/gi) != null){
                return 'docx';
            }else if(url?.match(/\.(doc)$/gi) != null){
                return 'doc';
            }else if(url?.match(/\.(7z)$/gi) != null){
                return '7z';
            }else if(url?.match(/\.(xls)$/gi) != null){
                return 'xls';
            }else if(url?.match(/\.(jfif)$/gi) != null){
                return 'jfif';
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
            }else if(url?.match(/\.(html)$/gi) != null){
                return 'html';
            }
            
          }
        function formatBytes(x) {
            const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                let l = 0, n = parseInt(x, 10) || 0;
                while(n >= 1024 && ++l){
                    n = n/1024;
                }
             return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
        }
        var feUrl = environment.frontEndUrl;
        // console.log('sahgdhs',checkURL(model.documentFileName))
        let fileTypeName:any;
if(data === 'order'){
    fileTypeName = checkURL(model.documentName)
}
else{
    fileTypeName = checkURL(model.documentFileName)
}
        return {
            // createdBy: model?.createdBy,
            documentCreatedDate: model.documentCreatedDate && formatDate(model.documentCreatedDate) || '',
            // updatedBy: model.updatedBy,
            createdDate: model.createdDate && formatDate(model.createdDate) || '',

            documentUpdatedDate: model.documentUpdatedDate && formatDate(model.documentUpdatedDate) || '',
            documentName: model?.documentName,
            documentId: model?.documentId,
            // activateFlag: model.activateFlag === 1 ? 'Active' : 'Inactive',
            documentSubChildCategoryId: model?.documentSubChildCategoryId,
            documentSubChildFourthCategoryId: model?.documentSubChildFourthCategoryId,
            documentSubChildFourthCategoryName: model?.documentSubChildFourthCategoryName,
            documentCategoryId: model.documentCategoryId,
            documentSubCategoryId: model?.documentSubCategoryId,
            hasDownloadAccess:model?.hasDownloadAccess,
            deleteFlag:model.deleteFlag,
            documentFileName:model?.documentFileName,
            documentFileSize: model?.documentFileSize && formatBytes(model?.documentFileSize) || '' ,
            documentFileType:model?.documentFileType,
            extension: model?.extension,
            imgSrc: model?.imgSrc,
            wishList: model?.wishList,
            feedBack: model?.feedBack,
            releaseDate: releaseDate,
            shareUrl: feUrl+"/master/detailed-view/"+model.documentId+"/"+model.documentFileId,
            thumbnailUrl: model?.thumbnailUrl,
            downloadUrl: model?.downloadUrl,
            downloadFlag: model?.downloadFlag,
            image:model?.thumbnailUrl,
            orderId:model?.orderId,
            orderNumber:model?.orderNumber,
            orderOn:model?.orderOn && formatDate(model.orderOn) || '',
            quantity:model?.quantity,
            deliveredOn:model?.deliveredOn && formatDate(model.deliveredOn) || '',
            orderAmount:model?.orderAmount,
            orderStatus:model?.orderStatus,
            isChecked:false,
            userCartId:model?.userCartId,
            documentFileId:model?.documentFileId,
            productFlag:model?.productFlag,
            wishlistId:model?.wishlistId,
            price:model?.price,
            currency:model?.currency,
            count:1,
            extensionType:fileTypeName,
            expiryDate: model?.expiryDate && formatDate(model?.expiryDate) || '-',
            isLoaded:false,
            checked:model?.checked
        };

    }
    

    static mapToModel(model: EndUserView, userService: UserService): EndUserMasterModel {
        return {
            // documentName: model?.documentName,
            documentFileName:model?.documentFileName,
            documentFileId: model?.documentFileId,
            // wishList: model?.wishList,
            feedBack: model?.feedBack,
            racfId: userService.getRacfId(),
            feedbackId: null,
        }
    };
    

}
