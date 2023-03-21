export class SubCatMaster {
    documentSubCategoryId?: string;
    //documentCategoryId?: string;
    //documentCategory?: string;
    documentSubCategoryName?:string;
    //category2?:string;
    deleteFlag?: number;
    activeFlag?: number;
    createdDate?:string;
    updatedDate?:string;
    createdBy?:string;
    updatedBy?:string;
    language?: string;
    status?:string;
    isEdit?: number;
    isActive?:number;
    currentUser?: string;
    documentCategoryName?:string;
    childFourthCategory:Array<{ documentSubChildCategoryId:number,
      documentSubChildCategoryName:string,
      deleteFlag:number,
      documentSubChildFourthCategoryId:number,
      documentSubChildFourthCategoryName:string,}>;
    documentCategoryId?:number;
      documentSubChildCategory:Array<{
        documentSubChildCategoryId:number,
        documentSubChildCategoryName:string,
        deleteFlag:number,
        childFourthCategory:Array<{
          documentSubChildFourthCategoryId:number,
          documentSubChildFourthCategoryName:string,
          deleteFlag:number,
          //createdBy: string,
          //createdDate:string,
          //updatedBy: string,
          //updatedDate:string
      }>;
        //createdBy: string,
        //createdDate:string,
        //updatedBy: string,
        //updatedDate:string
    }>;
     
   
}
