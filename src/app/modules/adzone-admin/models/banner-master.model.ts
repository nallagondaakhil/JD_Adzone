export interface BannerMasterModel {
    file1Name?: string;
    file1Url?: string;
    file2Name?: string;
    file2Url?: string;
    file3Name?: string;
    file3Url?: string;
    file4Name?: string;
    file4Url?: string;
    file5Name?: string;
    file5Url?: string;
    documentCategoryId?: number;
    activeFlag?: number;
    createdDate?: string;
    deleteFlag?:number;
    bannerId?:number;
    imageNo?:number;
    imageName?:string;
    imageUrl?:string;
}
 
export interface bannerListMaster{
    bannerId?:number;
    imageNo?:number;
    imageName?:string;
    imageUrl?:string;
    documentCategoryId?: number;
    activeFlag?: number;
    createdDate?: string;
    deleteFlag?:number;
}

