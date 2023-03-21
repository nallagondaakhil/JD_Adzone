export interface VendorManagement {
    vendorId?: number;
    vendorName?: string;
    emailid?: string;
    phonenumber?:number;
    racfId?: string;
    roleId?: string;
    activateFlag?: number;
    status?:string;
    address?:string;
    marketId?: number,
    // roles: {
    //   id: string;
    //   name: string;
    // }
    //vistarUserFlag?: string; // empty for cms user
    regionId?:number;
    regionName?:string;
    subregionId?:number,
    subregionName?:string,
    marketName?:string,
    vendorCode?:string,
    marketResponseDto?:  Array<
    {
        marketId?: number,
        marketName?: string,
    }
    >;
    market?:  Array<
    {
        marketId?: number,
        marketName?: string,
    }
    >;

documentMarketMapping ?:  Array<
    {
        marketId?: number,
        marketName?: string,
    }
    >;
    regionResponseDto?:  Array<
{
    regionId?: number,
    regionName?: string,
}
>;
    region?:  Array<
    {
        regionId?: number,
        regionName?: string,
    }
    >;
    subRegionResponseDto?:  Array<
    {
        subRegionId?: number,
        subRegionName?: string,
    }
    >;
    subRegion?:  Array<
    {
        subRegionId?: number,
        subRegionName?: string,
    }
    >;
    divisionResponseDto?:  Array<
    {
        divisionId?: number,
        divisionName?: string,
    }
    >;
    division?:  Array<
    {
        divisionId?: number,
        divisionName?: string,
    }
    >;
    deleteFlag?:number,
    syncFl?:number;
    createdBy?:string;
    updatedBy?:string;
    createdDate?:string;
    updatedDate?:string;
    jdUsers?:string;
    currentUser: string;
}
