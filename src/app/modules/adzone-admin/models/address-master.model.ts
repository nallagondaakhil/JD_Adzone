export interface AddressMasterModel{
    addressId?: number;
    city?: string;
    contactNumber?: string;
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
    marketId?:number;
    country?:string;
    formattedAddress?:string;
}