export interface DocumentTypeMasterModel {
    fileType?:string;
    multipleThumbnailResponseDto?:number;
    checked?:boolean,
    thumbailDocumentId?:string;
    thumbnailFileURL?:string;
    thumbnailFileSize?: string;
    thumbnailFileName?:string;
    documentId?: number,
    documentCount?:number,
    documentName?: string,
    activeFlag?: number,
    createdDate?: string,
    updatedDate?: string,
    createdBy?: string,
    updatedBy?: string,
    documentSubChildCategoryId?:number,
    documentSubChildFourthCategoryId?:number;
    documentSubChildFourthCategoryName?:string;
    marketId?: number,
    documentSubCategoryId?:number,
    documentSubChildCategoryName?:string,
    documentCategoryName?:string;
    documentCategoryId?:number;
    documentSubCategoryName?:string;
    regionId?:number;
    // rejectionReason?:string;
    // publishStatus:any,
    regionName?:string;
    subregionId?:number,
    subregionName?:string,
    marketName?:string,
    thumbnailId?:string,
    thumbnailName?:string,
    fileId?:number,
    fileName?:string,
    fileS3Url?:string,
    currentUser?: string,
    thumbnailUrl?:string,
    expiryDate?:string,
    editable?:boolean,
    market?:  Array<
        {
            marketId?: number,
            marketName?: string,
        }
    >;
    markets ?:  Array<
    {
        marketId?: number,
        marketName?: string,
    }
    >;
    region?:  Array<
        {
            regionId?: number,
            regionName?: string,
        }
    >;
    approval?:  Array<
        {
            id?: number,
            name?: string,
        }
    >;
    subRegion?:  Array<
        {
            subRegionId?: number,
            subRegionName?: string,
        }
    >;
    division?:  Array<
        {
            divisionId?: number,
            divisionName?: string,
        }
    >;
    divisions?:  Array<
        {
            divisionId?: number,
            divisionName?: string,
        }
    >;
    files?:  Array<
        {
            fileId?: number,
            fileName?: string,
            fileS3Url?:string,
            createdDate?:string,
            createdBy?:string,
            inSearch?:boolean
    }
        
    >;
    file?:  Array<
    {
        fileId?: number,
        fileName?: string,
        fileS3Url?:string,
    }
    
>;
    deleteFlag?:number,
    deleteFileIdList?: Array<{
        fileId: number,
        fileName: string,
    }>;
}
