import { UserService } from "src/app/core/services/user.service";
import { CurrencyInputComponent } from "src/app/shared/components/currency-input/currency-input.component";
import { environment } from "src/environments/environment";
import { NotificationMastermodel } from "../../models/admin-notification.model";

export class NotificationView {
    actionId?: string;
    createdBy?: string;
    createdDate?: string;
    deliveredOn?: string;
    isRead?: boolean;
    message?: string;
    notificationId?: number;
    notificationModule?: string;
    orderId?: number;
    orderNumber?: number;
    orderOn?: string;
    orderStatus?: string;
    racfId?: string;
    redirectionId?: string;
    redirectionPage?: string;
    updatedBy?: string;
    updatedDate?: string;
    feedBack?: any;
    type?:any;
    documentDeletedBy?:any;
    documentId?:any;
    fileName?:any;
    documentFileName?:any;
    documentFileId?:any;
    documentExpiryDate?:any;
    approveDate?:any;
}



export class AdminNotificationModelMapper {
    static async mapToViewModel(model: NotificationMastermodel): Promise<NotificationView> {
        function formatDate(date) {
            console.log('formater',date)
            if(date != null){
                var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
        
            return [day, month, year].join('-');
            }
            
        }
        return {
            actionId: model?.actionId,
            createdBy: model?.createdBy,
            createdDate: formatDate(model?.createdDate),
            deliveredOn: model?.deliveredOn,
            isRead: model?.read,
            message: model?.message,
            notificationId: model?.notificationId,
            notificationModule: model?.notificationModule,
            orderId: model?.orderId,
            orderNumber: model?.orderNumber,
            orderOn: model?.orderOn,
            orderStatus: model?.orderStatus,
            racfId: model?.racfId,
            redirectionId: model?.redirectionId,
            redirectionPage: model?.redirectionPage,
            updatedBy: model?.updatedBy,
            updatedDate: model?.updatedDate,
            feedBack:model?.feedBack,
            type:model?.type,
            documentDeletedBy:model?.documentDeletedBy,
            documentId:model?.documentId,
            fileName:model?.fileName,
            documentFileName:model?.documentFileName,
            documentFileId:model?.documentFileId,
            documentExpiryDate:model?.documentExpiryDate,
            approveDate:formatDate(model?.approveDate),
        }
    }

    static mapToModel(model: NotificationView, service: UserService): NotificationMastermodel {
        return {
            
        }
    };
    
}