import { UserService } from "src/app/core/services/user.service";
import { MasterDataModel } from "src/app/modules/admin/models/master-data.model";
import { MasterDataService } from "src/app/modules/admin/services/master-data.service";
import { ArrayUtil } from "src/app/shared/utils/array.util";
import { VendorManagement } from "../../models/vendor-management.model";

export interface VendorManagementView {
    vendorId?: number;
    vendorName?: string;
    racfId?: string;
    emailid?: string;
    phonenumber?:number;
    roleType?: {id: string, name: string};
    dealerships?: MasterDataModel[];
    regionId?: Array<{id: number, name: string}>;
    subRegionId?: Array<{id: number, name: string}>;
    country?: Array<{id: number, name: string}>;
    activateFlag?: string;
    vendorCode?:string;
    status?: string;
    address?: string;
    createdBy?:string;
    updatedBy?:string;
    createdDate?:string;
    updatedDate?:string;
    marketResponseDto?: Array<{
        id: number,
        name: string,
    }>;
    regionResponseDto?: Array<{
        id: number,
        name: string,
    }>;
    subRegionResponseDto?: Array<{
        id: number,
        name: string,
    }>;
    deleteFlag?:number;
    divisionResponseDto?: Array<{
        id: number,
        name: string,
    }>;
}
export class VendorManagementModelMapper {
    static async mapToViewModel(model: VendorManagement, masterDataService: MasterDataService): Promise<VendorManagementView> {
       
            return {
                vendorId: model?.vendorId,
                vendorName: model?.vendorName,
                racfId: model?.racfId,
                emailid: model?.emailid,
                phonenumber:model?.phonenumber,
                //roleType: model.roles && {id: model.roles.id, name: model.roles.name},
                activateFlag: model.activateFlag === 1 ? 'Active' : 'Inactive',
                regionId: [{id:model.regionId,name:model.regionName}],
                subRegionId: [{id:model.subregionId,name:model.subregionName}],
                country: [{id:model.marketId,name:model.marketName}],
                deleteFlag:model.deleteFlag,
                createdDate:model?.createdDate,
                address:model?.address,
                vendorCode:model?.vendorCode,
                createdBy:model?.createdBy,
                updatedBy:model?.updatedBy,
                updatedDate:model?.updatedDate,
                marketResponseDto: model?.marketResponseDto?.map(x=>
                    {
                        return  {id:x?.marketId, name:x?.marketName}
                    }),
                    regionResponseDto: model?.regionResponseDto?.map(x=>
                    {
                        return  {id:x?.regionId, name:x?.regionName}
                    }),
                    subRegionResponseDto: model?.subRegionResponseDto?.map(x=>
                    {
                        return  {id:x?.subRegionId, name:x?.subRegionName}
                    }),
                    divisionResponseDto: model?.divisionResponseDto?.map(x=>
                    {
                        return  {id:x?.divisionId, name:x?.divisionName}
                    }),
            };
        }
    

    static mapToModel(model: VendorManagementView,userService: UserService): VendorManagement {
       
        return {
            vendorId: model.vendorId,
            vendorName: model.vendorName,
            racfId: model.racfId,
            emailid: model.emailid,
            phonenumber:model.phonenumber,
            //roleId: model.roleType?.id,
            //roles: model.roleType,
            deleteFlag:model?.deleteFlag,
            address:model?.address,
            vendorCode:model?.vendorCode,
            //activateFlag: model.activateFlag === 'Active' ? 1 : 0,
            //userDealershipMappingList: dealers?.map(x => ({dealershipId: x.id, deleteFl: x.isDeleted ? 1 : 0})),
            currentUser: userService.getRacfId(),
            market: model?.marketResponseDto?.map(x=>
                {
                    return {marketId: x?.id, marketName:x?.name}
                }),
                region: model?.regionResponseDto?.map(x=>
                {
                    return {regionId: x?.id, regionName:x?.name}
                }),
                subRegion: model?.subRegionResponseDto?.map(x=>
                {
                    return {subRegionId: x?.id, subRegionName:x?.name}
                }),
                division: model?.divisionResponseDto?.map(x=>
                    {
                        return {divisionId: x?.id, divisionName:x?.name}
                    }),
           
        };
    }
}
