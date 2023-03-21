import { Component, OnInit } from '@angular/core';
import { OktaService } from './../../core/services/oktaauth.service';
@Component({
  selector: 'jd-oktacallback',
  templateUrl: './oktacallback.component.html',
  styleUrls: ['./oktacallback.component.scss']
})
export class OktacallbackComponent implements OnInit {

  constructor(private okta: OktaService) {
    
   }

  ngOnInit(): void {
    this.okta.handleAuthentication(); 
  }

}
