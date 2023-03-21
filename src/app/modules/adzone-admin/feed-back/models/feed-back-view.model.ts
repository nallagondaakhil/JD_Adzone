import { FeedbackService } from "../../services/feedback.service";
import { FeedBackMasterModel } from "../../models/feed-back-master.model";
export class FeedBackView {
    feedBack?:string;
    name?:string;
    emailId?:string;
    rating?:string;
    nameEmailSavedFlag?:boolean;


}
export class FeedBackModelMapper {
    static mapToModel(model: FeedBackView, service: FeedbackService): FeedBackMasterModel {
        return {
            feedBack: model?.feedBack,
            name: model?.name,
            emailId: model?.emailId,
            rating: model?.rating,
            nameEmailSavedFlag:model?.nameEmailSavedFlag
        }
    };
}