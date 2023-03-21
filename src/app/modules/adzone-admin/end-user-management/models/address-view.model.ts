import { UserService } from "src/app/core/services/user.service";
import { CurrencyInputComponent } from "src/app/shared/components/currency-input/currency-input.component";
import { environment } from "src/environments/environment";
import { AddressMasterModel } from "../../models/address-master.model";

export class AddressView {
    addressId?: number;
    city?: string;
    contactNumber?: string;
    country?: string;
    createdBy?: string;
    createdDate?: string;
    deleteFlag?: number
    email?: string;
    name?: string;
    pincode?: string;
    state?: string;
    streetAddress?: string;
    updatedBy?: string;
    updatedDate?: string;
    marketId?:Array<{id: number, name: string}>;
    formattedAddress?:string;
}



export class AddressModelMapper {
    static async mapToViewModel(model: AddressMasterModel): Promise<AddressView> {
        return {
            addressId: model?.addressId,
            city: model?.city,
            contactNumber: model?.contactNumber,
            createdBy: model?.createdBy,
            createdDate: model?.createdDate,
            deleteFlag: model?.deleteFlag,
            email: model?.email,
            name: model?.name,
            pincode: model?.pincode,
            state: model?.state,
            streetAddress: model?.streetAddress,
            updatedBy: model?.updatedBy,
            updatedDate: model?.updatedDate,
            marketId: [{id:model?.marketId,name:model?.country}],
            formattedAddress: model?.formattedAddress,
        };
        
    }

    static mapToModel(model: AddressView, service: UserService): AddressMasterModel {
        return {
            addressId: model?.addressId,
            city: model?.city,
            contactNumber: model?.contactNumber,
            createdBy: service?.getRacfId(),
            email: model?.email,
            name: model?.name,
            pincode: model?.pincode,
            state: model?.state,
            streetAddress: model?.streetAddress,
            marketId: model?.marketId[0]?.id,
            country: model?.marketId[0].name,
        }
    };
    
}