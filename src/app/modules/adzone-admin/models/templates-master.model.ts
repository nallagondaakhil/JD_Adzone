export interface TemplatesMasterModel {
    racfId?: string,
    templateName?: string,
    templateImageUrl?: string,
    extension?: string,
}

export interface MyTemplatesMasterModel {
    racfId?: string,
    templateName?: string,
    templateImageUrl?: string,
    extension?: string,
    templateDownloadDetailId?:number,
    createdDate?: string,
}
