export interface EndUserMasterModel {
    // activateFlag?: number;
    // createdBy?: string;
    documentCreatedDate?: string;
    createdDate?:string;
    deleteFlag?: number;
    documentCategoryId?: number;
    documentCategoryName?: string;
    documentId?: number;
    documentName?: string;
    hasDownloadAccess?:boolean;
    documentSubCategoryId?: number;
    documentSubCategoryName?: string;
    documentSubChildCategoryId?: number;
    documentSubChildCategoryName?: string;
    documentSubChildFourthCategoryId?: number;
    documentSubChildFourthCategoryName?: string;
    feedBack?:string;
    // updatedBy?: string;
    documentUpdatedDate?: string;
    documentFileName?: string;
    documentFileSize?:string;
    documentFileType?:string;
    extension?:string;
    imgSrc?:string;
    wishList?:boolean;
    racfId?:string;
    feedbackId?:number;
    thumbnailUrl?: string;
    orderId?:number;
    orderNumber?:number;
    orderOn?:string;
    quantity?:string;
    deliveredOn?:string;
    orderAmount?:string;
    orderStatus?:string;
    lastNDays?:string;
    userCartId?:number;
    productFlag?:number;
    documentFileId?:number;
    wishlistId?:number;
    currency?:string;
    price?:string;
    extensionType?:string;
    expiryDate?: string;
    downloadUrl?:string;
    downloadFlag?:string;
    checked?:number;
}

export interface EndUserPayLoad {
    documentCategoryId?:number;
    documentSubCategoryId?:number;
    racfId?:string;
    documentCategoryName?:string;
    documentSubCategoryName?:string;
    documentFileSizeStartRange: string;
    documentFileSizeEndRange:string;
    documentSearch:string;
    documentSortId:string;
    documentSortName:string;
    documentSortBy:string;
    documentSubChildCategoryId:string;
    documentSubChildCategoryName:string;
    documentSubChildFourthCategoryId:string;
    documentSubChildFourthCategoryName:string;
    documentFileType:string;
    orderStatus:string;
    lastNDays:string;
    languageId ?:string;
    
}
export interface MyOrderPayload{
    orderStatusList?:string;
    lastNDays?:string;
    racfId?:string;
    maxPrice?:number;
    minPrice?:number;
    productFlag?:number;

    
}
