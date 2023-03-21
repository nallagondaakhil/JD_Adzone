import { UserService } from "src/app/core/services/user.service";
import { CurrencyInputComponent } from "src/app/shared/components/currency-input/currency-input.component";
import { environment } from "src/environments/environment";
import { CategoryCountReportMasterModel } from "../../models/document-cat-count-report-master.model";

export class CategoryCountReportView {
    createdDate?: string;
    documentCategoryName?: string;
    documentCount?: number;
    countOfLogin?:string;
    documentFileSizeCount?: string;
    documentFileSizeFormatted?:number;
    documentFileType?: string;
    dealerName?:string;
    dealerCode?:string;
    dealerAccountId?:number;
    userRole?:string;
    userName?:string;
    userId?:string;
    documentDownloadCount?:number;
    subCategoryName?:string;
    categoryName?:string;
    month?:string;
    year?:number;
    roleName?:string;
    documentUploadBy?: string;
    documentUploadCount?: number;
    racfId?:string;
    dealerId?:string;
    orderCounts?:number;
    supplierName?:string;
    activeDuration?:string;
    logOutTime?:string;
    logInTime?:string;
    loginTime?:string;
}


    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   
    function formatBytes(x){

    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }
    
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    }
export class CategoryCountReportModelMapper {
    

    static async mapToViewModel(model: CategoryCountReportMasterModel): Promise<CategoryCountReportView> {
        return {
            createdDate: model?.createdDate,
            documentCategoryName: model?.documentCategoryName,
            documentCount: model?.documentCount,
            documentFileSizeFormatted:model?.documentFileSizeFormatted,
            documentFileSizeCount: formatBytes(model?.documentFileSizeCount),
            documentFileType: model?.documentFileType,
            dealerName:model?.dealerName,
            dealerAccountId:model.dealerAccountId,
            userRole:model.userRole,
            userName:model.userName,
            userId:model.userId,
            countOfLogin:model.countOfLogin,
            documentDownloadCount:model.documentDownloadCount,
            subCategoryName:model.subCategoryName,
            categoryName:model.categoryName,
            month:model.month,
            year:model.year,
            roleName: model?.roleName,
            dealerCode:model?.dealerCode,
            documentUploadBy: model?.documentUploadBy,
            documentUploadCount: model?.documentUploadCount,
            racfId:model.racfId,
            dealerId:model.dealerId,
            orderCounts:model.orderCounts,
            supplierName:model.supplierName,
            activeDuration:model.activeDuration,
            logInTime:model.loginTime,
            loginTime:model.logInTime,
            logOutTime:model.logOutTime,
        };
        
    }

    static mapToModel(model: CategoryCountReportView, service: UserService): CategoryCountReportMasterModel {
        return {
            
        }
    };
    
}