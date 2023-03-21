import { UserService } from "src/app/core/services/user.service";
import { OrderAdminMasterModel, SelectedOrderMastermodel } from "../../models/admin-order.model";
import { OrderAdminService } from "../../services/admin-order.service";

export interface OrderAdminViewModel {
    activeFlag?: number,
    createdDate?: string,
    updatedDate?: string,
    createdBy?: string,
    updatedBy?: string,
    address?: string,
    deleteFlag?: number,
    deliveredOn?: string,
    documentFileId?: number,
    documentId?: number,
    documentName?: string,
    orderAmount?: number,
    orderId?: number,
    orderNumber?: number,
    orderOn?: string,
    orderStatus?: string,
    productFlag?: number,
    quantity?: number,
    racfId?: string,
    thumbnailUrl?:string,
    isChecked?:boolean,
    total?:number,
    productDescription?:string,
    spaceAddress?:string,
    displayProductFlag?:string,
}

export interface SelectedOrderViewModel {
    name: string;  
    id: number;  
    isChecked?: number;
    
}

export class SelectedOrderMapper {

    static async mapToViewModel(model: SelectedOrderMastermodel): Promise<SelectedOrderViewModel> {
  
       return {
  
           name: model.name,
  
           id: model.id,
  
           isChecked: model.isChecked,
  
           
       }
  
    }
}

export class AdminOrderModelMapper {
    static async mapToViewModel(model: OrderAdminMasterModel, service: OrderAdminService): Promise<OrderAdminViewModel> {
        function formatText(text) {
            var newchar = ' , '
            text = text?.split(',').join(newchar);
        
            return text;
        }
        return {
            activeFlag: model.activeFlag,
            createdDate: model.createdBy,
            updatedDate: model.updatedDate,
            createdBy: model.createdBy,
            updatedBy: model.updatedBy,
            address: model.address,
            deleteFlag: model.deleteFlag,
            deliveredOn: model.deliveredOn,
            documentFileId: model.documentFileId,
            documentId: model.documentId,
            documentName: model.documentName,
            orderAmount: model.orderAmount,
            orderId: model.orderId,
            orderNumber: model.orderNumber,
            orderOn: model.orderOn,
            orderStatus: model.orderStatus,
            productFlag: model.productFlag,
            quantity: model.quantity,
            racfId: model.racfId,
            thumbnailUrl: model?.thumbnailUrl,
            isChecked: false,
            total: model?.total,
            productDescription: model?.productDescription,
            spaceAddress: formatText(model?.address),
            displayProductFlag : model?.productFlag == 0 ? "Downloaded" : "Order",
        };
       
    }
 
    static mapToModel(model: OrderAdminViewModel, userService: UserService): OrderAdminMasterModel {
        return {
           
        }
    };
   
}
