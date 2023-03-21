import { UserService } from "src/app/core/services/user.service";
import { DealerManagementMasterModel } from "../../models/dealer-management-master.model";
import { DealerManagementService } from "../../services/dealer-management.service";

export interface DealerManagementViewModel {
    address?: string,
    contactNumber?: string,
    dealerCode?: string,
    dealerName?: string,
    divisionId?: string,
    divisionName?: string,
    emailId?: string,
    marketId?: string,
    marketName?: string,
    regionId?: string,
    regionName?: string,
    status?: string,
    subRegionId?: string,
    subRegionName?: string
}

export class DealerManagementModelMapper {
    static async mapToViewModel(model: DealerManagementMasterModel, service: DealerManagementService): Promise<DealerManagementViewModel> {
        return {
            address: model?.address,
            contactNumber: model?.contactNumber,
            dealerCode: model?.dealerCode,
            dealerName: model?.dealerName,
            divisionId: model?.divisionId,
            divisionName: model?.divisionName,
            emailId: model?.emailId,
            marketId: model?.marketId,
            marketName: model?.marketName,
            regionId: model?.regionId,
            regionName: model?.regionName,
            status: model?.status === 1 ? 'Active' : 'Inactive',
            subRegionId: model?.subRegionId,
            subRegionName: model?.subRegionName
        };
       
    }
 
    static mapToModel(model: DealerManagementViewModel, userService: UserService): DealerManagementMasterModel {
        return {
           
        }
    };
   
}
