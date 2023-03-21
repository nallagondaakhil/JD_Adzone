import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "src/app/modules/admin/models/paged-data.model";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class CommonSyncService {
  // baseApiUrl = environment.apiBaseUrl;
  public editDataDetails1: any = [];

  private messageSource1 = new  BehaviorSubject(this.editDataDetails1);
  currentMessage1 = this.messageSource1.asObservable();
  private messageSource = new  BehaviorSubject(this.editDataDetails1);
  currentMessage = this.messageSource.asObservable();

  apiUrl = environment.apiBaseUrl;
    constructor(private http: HttpClient) {
    }

    getCommonSync(): Promise<ApiResponse<any>> {
      const url = `${this.apiUrl}/api/v1/dealershipController/addDealerFromVistar`;
      return this.http.get<ApiResponse<any>>(url).toPromise();
    }
    changeMessage1(message1: any,data:any) {
      console.log('data',message1)
      this.messageSource1.next(message1)
      }
    changeMessage(message: any) {
      console.log('data',message)
      this.messageSource.next(message)
      }
  }   