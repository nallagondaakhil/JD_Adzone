
export interface UserManagement {
    userId?: string;
    userName?: string;
    emailId?: string;
    phoneNumber?:number;
    racfId?: string;
    roleId?: number;
    roleName?:string;
    activateFlag?: number;
    status?:string;
    emailid?:string;
    phonenumber?:number;
    marketId?: number,
    updatedDate?:string;
    updatedBy?:string;
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
    currentUser?: string,
    marketResponseDto?:  Array<
    {
        marketId?: number,
        marketName?: string,
    }
    >;
    dealerResponseDto?:  Array<
    {
        dealerCode?: number,
        dealerName?: string,
    }
    >;
    // role?:  Array<
    // {
    //     roleId?: number,
    //     roleName?: string,
    // }
    // >;
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

dealer?:  Array<
{
    dealerId?: number,
    dealerName?: string,
}
>;
    deleteFlag?:number,
    syncFl?:number;
    createdBy?:string;
    createdDate?:string;
    jdUsers?:string;
}
