import { UserService } from "src/app/core/services/user.service";
import { MasterDataModel } from "src/app/modules/admin/models/master-data.model";
import { MasterDataService } from "src/app/modules/admin/services/master-data.service";
import { ArrayUtil } from "src/app/shared/utils/array.util";
import { UserManagement } from "../../models/user-management.model";
import { UsermanagementService } from "../../services/usermanagement.service";
export class UserManagementView {
    userId?: any;
    userName?: string;
    racfId?: string;
    emailId?: string;
    phoneNumber?: number;
    roleType?: { id: string, name: string };
    dealerships?: MasterDataModel[];
    regionId?: Array<{ id: number, name: string }>;
    subRegionId?: Array<{ id: number, name: string }>;
    country?: Array<{ id: number, name: string }>;
    activateFlag?: string;
    status?: string;
    updatedDate?:string;
    createdBy?: string;
    createdDate?: string;
    updatedBy?:string;
    // roleId?: number;
    roleId?:Array<{id: number, name: string}>;
    roleName?:string;
    dealerId?:Array<{id:number,name:string}>;
    marketResponseDto?: Array<{
        id: number,
        name: string,
    }>;
    dealerResponseDto?: Array<{
        id: number,
        name: string,
    }>;
    // role?: Array<{
    //     id: number,
    //     name: string,
    // }>;

    regionResponseDto?: Array<{
        id: number,
        name: string,
    }>;
    subRegionResponseDto?: Array<{
        id: number,
        name: string,
    }>;
    deleteFlag?: number;
    divisionResponseDto?: Array<{
        id: number,
        name: string,
    }>;
}
export class UserManagementModelMapper {
    static async mapToViewModel(model: UserManagement, masterDataService: MasterDataService): Promise<UserManagementView> {
        return {
            userId: model?.userId,
            userName: model?.userName,
            racfId: model?.racfId,
            emailId: model?.emailId,
            phoneNumber: model?.phoneNumber,
            //roleType: model.roles && {id: model.roles.id, name: model.roles.name},
            activateFlag: model.activateFlag === 1 ? 'Active' : 'Inactive',
            regionId: [{ id: model.regionId, name: model.regionName }],
            subRegionId: [{ id: model.subregionId, name: model.subregionName }],
            country: [{ id: model.marketId, name: model.marketName }],
            deleteFlag: model.deleteFlag,
            createdDate: model?.createdDate,
            createdBy: model?.createdBy,
            updatedDate: model?.updatedDate,
            updatedBy:model?.updatedBy,
            marketResponseDto: model?.marketResponseDto?.map(x => {
                return { id: x?.marketId, name: x?.marketName }
            }),
            dealerResponseDto: model?.dealerResponseDto?.map(x => {
                return { id: x?.dealerCode, name: x?.dealerName }
            }),
            regionResponseDto: model?.regionResponseDto?.map(x => {
                return { id: x?.regionId, name: x?.regionName }
            }),
            subRegionResponseDto: model?.subRegionResponseDto?.map(x => {
                return { id: x?.subRegionId, name: x?.subRegionName }
            }),
            divisionResponseDto: model?.divisionResponseDto?.map(x => {
                return { id: x?.divisionId, name: x?.divisionName }
            }),
            roleId: [{id:model.roleId,name:model.roleName}],
            // role: model?.role?.map(x => {
            //     return { id: x?.roleId, name: x?.roleName }
            // }),
            // roleId:model.roleId,
        };
        
    }


    static mapToModel(model: UserManagementView,userService: UserService): UserManagement {
        return {
            userId: model.userId,
            userName: model.userName,
            racfId: model.racfId,
            emailId: model.emailId,
            phoneNumber: model.phoneNumber,
            // roleId: model?.roleId,
            roleId: model?.roleId[0]?.id,
            //roles: model.roleType,
            deleteFlag: model?.deleteFlag,
            currentUser: userService.getRacfId(),
            updatedDate: model?.updatedDate,
            //activateFlag: model.activateFlag === 'Active' ? 1 : 0,
            //userDealershipMappingList: dealers?.map(x => ({dealershipId: x.id, deleteFl: x.isDeleted ? 1 : 0})),
            market: model?.marketResponseDto?.map(x => {
                return { marketId: x?.id, marketName: x?.name }
            }),
            region: model?.regionResponseDto?.map(x => {
                return { regionId: x?.id, regionName: x?.name }
            }),
            subRegion: model?.subRegionResponseDto?.map(x => {
                return { subRegionId: x?.id, subRegionName: x?.name }
            }),
            dealer: model?.dealerResponseDto?.map(x => {
                return { dealerCode: x?.id, dealerName: x?.name }
            }),
            division: model?.divisionResponseDto?.map(x => {
                return { divisionId: x?.id, divisionName: x?.name }
            }),
        };
    }
}

