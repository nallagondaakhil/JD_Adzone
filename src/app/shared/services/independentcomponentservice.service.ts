import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FilterSettings } from '../components/data-table/models/data-table-model';
//import { ApiResponse, PagedRequestOptions, PagedResponse } from "../../modules/adzone-admin";
@Injectable({
  providedIn: 'root'
})
export class IndependentcomponentserviceService {
  storedValues1:any;
  
  constructor() { }
public editDataDetails: any = [];
public subject = new Subject<any>();
private messageSource = new  BehaviorSubject(this.editDataDetails);
private messageSourceNotification = new  BehaviorSubject(this.editDataDetails);
private messageSourceDealer = new  BehaviorSubject(this.editDataDetails);
private messageSourceSearch = new  BehaviorSubject(this.editDataDetails);
private messageSourceUpload = new  BehaviorSubject(this.editDataDetails);
currentMessage = this.messageSource.asObservable();
currentMessageNotification = this.messageSourceNotification.asObservable();
currentMessageUpload = this.messageSourceUpload.asObservable();
currentMessagedealer = this.messageSourceDealer.asObservable();
currentMessageSearch = this.messageSourceDealer.asObservable();
model:any;
changeMessage(message: any) {
if(message)

this.messageSource.next(message)
}
dealerViewTop(message: any) {
  this.messageSourceDealer.next(message)
  }
changeMessageNotification(message: any) {
  this.messageSourceNotification.next(message)
  }
changeSearch(message:any){
  console.log("hello",message);
  this.messageSourceSearch.next(message)
}
changeUpload(message:any){
  this.messageSourceUpload.next(message)
}
}



