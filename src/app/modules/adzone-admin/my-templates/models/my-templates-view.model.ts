import { UserService } from "src/app/core/services/user.service";
import { CurrencyInputComponent } from "src/app/shared/components/currency-input/currency-input.component";
import { environment } from "src/environments/environment";
import { MyTemplatesMasterModel } from "../../models/templates-master.model";

export class MyTemplateView {
    racfId?: string;
    templateName?: string;
    templateImageUrl?: string;
    extension?: string;
    templateDownloadDetailId?:number;
    createdDate?: string;
}



export class MyTemplatesModelMapper {
    static async mapToViewModel(model: MyTemplatesMasterModel): Promise<MyTemplateView> {
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
        
            return [day, month, year].join('-');
        }
        return {
            racfId: model?.racfId,
            templateName: model?.templateName,
            templateImageUrl: model?.templateImageUrl,
            extension: model?.extension,
            templateDownloadDetailId: model?.templateDownloadDetailId,
            createdDate: formatDate(model?.createdDate),
        };
        
    }

    static mapToModel(model: MyTemplateView, service: UserService): MyTemplatesMasterModel {
        return {
           
        }
    };
    
}