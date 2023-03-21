

import { Injectable } from "@angular/core";
import { UserService } from "src/app/core/services/user.service";
import { MasterDataService } from "src/app/modules/admin/services/master-data.service";
import { DocumentCategoryMasterModel } from "../../models/doc-cat-master.model";
export interface DocumentCategoryView {
    documentCategoryId?: string;
    documentCategoryName?: string;
    activeFlag?: string;
    createdDate?: string;
    updatedDate?: string;
    createdBy?: string;
    updatedBy?: string;
    isEdit?:number;
    isActive?: number;
    status?: string;
}

export class DocCategoryModelMapper {
    static async mapToViewModel(model: DocumentCategoryMasterModel, masterDataService: MasterDataService): Promise<DocumentCategoryView> {

        return {
            createdBy: model?.createdBy,
            createdDate: model.createdDate,
            updatedBy: model.updatedBy,
            updatedDate: model.updatedDate,
            documentCategoryName: model?.documentCategoryName,
            documentCategoryId: model?.documentCategoryId,
            // activateFlag: model.activateFlag,
            activeFlag: model.activeFlag === 1 ? 'Active' : 'Inactive',
        };
    }

    static mapToModel(model: DocumentCategoryView, userService: UserService): DocumentCategoryMasterModel {
        return {
            documentCategoryName: model?.documentCategoryName,
            documentCategoryId: model?.documentCategoryId,
            activeFlag: model.activeFlag === 'Active' ? 1 : 0,
            currentUser: userService.getRacfId(),
        };
    }

    
}
