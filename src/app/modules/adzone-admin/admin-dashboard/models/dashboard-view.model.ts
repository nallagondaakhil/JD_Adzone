import { DashboardMaster } from "../../models/dashboard-master.model"; 
import { DashoardServiceService } from "../../services/dashoard-service.service"; 
export interface DashboardViewModel
{
    pending?:number,
    processed?:number,
    delivered?:number,
    cancelled?:number,
    year?:Array<{id: number, name: number}>;
}

export class DocCategoryModelMapper{
    static async mapToViewModel(model: DashboardMaster, masterDataService: DashoardServiceService): Promise<DashboardViewModel> {
        return {
            pending: model?.pending,
            processed: model?.processed,
            delivered: model?.delivered,
            cancelled: model?.cancelled,
            year: model?.year?.map(x=>
                {
                    return  {id:x?.id, name:x?.name}
                }),

        };
    }
}