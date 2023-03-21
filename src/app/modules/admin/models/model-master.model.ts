export interface ModelMasterModel {
activeFl?: number;
categoryId?:number;
deleteFl?:number;
id?:number;
modelName?:string;
category: {
categoryId: number;
categoryName:  string;
createdBy?: string;
createdDate?:string;
isActive?: number;
updatedBy?: string;
updatedDate?: string;
//deleteFl?:number;

}
createdBy: string;
jdUsers:string;
createdDate:string;
syncFl?:number;
}
