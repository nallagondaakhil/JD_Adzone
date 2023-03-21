export interface OrderAdminMasterModel {
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
    thumbnailUrl?: string,
    isChecked?:boolean,
    total?:number,
    productDescription?:string,
}

export interface SelectedOrderMastermodel{
    name: string;  
    id: number;  
    isChecked?: number;
}
