import { UserService } from "src/app/core/services/user.service";
import { bannerListMaster, BannerMasterModel } from "../../models/banner-master.model";
import { BannerService } from "../../services/banner.service";
import { EndUserService } from "../../services/end-user.service";
 
export interface BannerViewModel {
    image?:string;
    fileName?: string;
    fileUrl?: string;
    documentCategoryId?: number;
    activeFlag?: number;
    createdDate?: string;
    deleteFlag?:number;
    bannerId?:number;
    imageNo?:number;
    imageName?:string;
    imageUrl?:string;
    id?:number;
}
 
export class BannerModelMapper {
    static async mapToViewModel(model: bannerListMaster, service: BannerService): Promise<BannerViewModel> {
        return {
            documentCategoryId: model.documentCategoryId,
            activeFlag: model.activeFlag,
            createdDate: model.createdDate,
            deleteFlag: model.deleteFlag,
            bannerId: model.bannerId,
            imageNo: model.imageNo,
            fileName: model.imageName,
            fileUrl: model.imageUrl,
            image:model.imageUrl
        };
       
    }
 
    static async bannerList(model: bannerListMaster): Promise<BannerViewModel> {
        return {
            // documentCategoryId: model[0].documentCategoryId,
            activeFlag: model.activeFlag,
            createdDate: model.createdDate,
            deleteFlag: model.deleteFlag,
            bannerId: model.bannerId,
            fileName: model.imageName,
            fileUrl: model.imageUrl,
            imageNo:model.imageNo,
            // file2Name: model.find(x => x.imageNo === 2).imageName || '',
            // file2Url: model.find(x => x.imageNo === 2).imageUrl || '',
            // file3Name: model.find(x => x.imageNo === 3).imageName || '',
            // file3Url: model.find(x => x.imageNo === 3).imageUrl || '',
            // file4Name: model.find(x => x.imageNo === 4).imageName || '',
            // file4Url: model.find(x => x.imageNo === 4).imageUrl || '',
            // file5Name: model.find(x => x.imageNo === 5).imageName || '',
            // file5Url: model.find(x => x.imageNo === 5).imageUrl || '',
        };
       
    }
 
 
    static mapToModel(model: BannerViewModel, userService: UserService): BannerMasterModel {
        return {
           
        }
    };
   
}

