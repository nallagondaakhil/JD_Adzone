export interface MyorderMasterModel {
    activateFlag?: number;
    createdBy?: string;
    createdDate?: string;
    deleteFlag?: number;
    documentCategoryId?: number;
    documentCategoryName?: string;
    documentId?: number;
    documentName?: string;
    documentSubCategoryId?: number;
    documentSubCategoryName?: string;
    documentSubChildCategoryId?: number;
    documentSubChildCategoryName?: string;
    files?: Array<
    {
        fileId?: number,
        fileName?: string,
        fileS3Url?:string,
        fileType?:string,
    }
    >;
    updatedBy?: string;
    updatedDate?: string;
}