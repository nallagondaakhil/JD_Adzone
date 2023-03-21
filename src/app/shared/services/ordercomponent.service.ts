import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdercomponentService {
  storedValues:any;
  constructor() { }
  public editDataDetails1: any = [];
  public subject1 = new Subject<any>();
  private messageSource1 = new  BehaviorSubject(this.editDataDetails1);
  //console.log(messageSource1);
  currentMessage1 = this.messageSource1.asObservable();
  
  changeMessage1(message1: any) {
    this.messageSource1.next(message1)
    }
}
