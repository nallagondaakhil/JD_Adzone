export interface ManageProductMasterModel {
    documentId?: number,
    documentName?: string,
    specification?:string,
    price?:string,
    currency?:string,
    activeFlag?: number,
    createdDate?: string,
    updatedDate?: string,
    createdBy?: string,
    updatedBy?: string,
    documentSubChildCategoryId?:number,
    marketId?: number,
    documentSubCategoryId?:number,
    documentSubChildCategoryName?:string,
    documentCategoryName?:string;
    documentCategoryId?:number;
    documentSubCategoryName?:string;
    regionId?:number;
    regionName?:string;
    subregionId?:number,
    subregionName?:string,
    marketName?:string,
    fileId?:number,
    fileName?:string,
    fileS3Url?:string,
    currentUser?: string,
    thumbnailUrl?:string,
    thumbnailId?:string,
    thumbnailName?:string,
    expiryDate?:string,
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
        }
    >;
    deleteFlag?:number,
}
