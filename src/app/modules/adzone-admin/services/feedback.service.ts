import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { HttpUtil } from "src/app/shared/utils/http.util";
import { environment } from "src/environments/environment";
import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../admin/models/paged-data.model";
import { FeedBackMasterModel } from "../models/feed-back-master.model";
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient,private userService : UserService) { }
  create(data: FeedBackMasterModel) {
    const url = `${this.apiUrl}/v1/api/FeedbackManagementService/saveCommonFeedback`;
    return this.http.post<ApiResponse<FeedBackMasterModel>>(url, data).toPromise();
}
  update() {
  
    const url = `${this.apiUrl}/v1/api/FeedbackManagementService/getCommonFeedback`;
    console.log('api triggered')
    return this.http.get<ApiResponse<FeedBackMasterModel>>(url).toPromise();
}
}
