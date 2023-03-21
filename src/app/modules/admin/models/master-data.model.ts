export interface MasterDataModel {
    id: number;
    name: string;
    url?: string;
    subMenu?: Array<{
        id: number,
        subMenuUrl: string,
    }>
    isActive?:boolean;
    isDeleted?: boolean;
    subRegions?: Array<{
        id: number,
        name: string,
    }>
    selectOptions?: Array<{
        id: number,
        name: string,
        type:string,
    }>;
}




// export interface MasterDataViewModel {
//     id: string;
//     name: string;
// }

// export class MasterDataMapper {
//     static mapToViewModel(model: MasterDataModel): MasterDataViewModel {
//         if (!model) { return; }
//         return {
//             id: model.id.toString(),
//             name: model.name
//         };
//     }

//     static mapToModel(model: MasterDataViewModel): MasterDataModel {
//         if (!model) { return; }
//         return {
//             id: Number(model.id),
//             name: model.name
//         };
//     }
// }
