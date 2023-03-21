import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { TemplatesService } from '../services/templates.service';
import { MyTemplatesModelMapper, MyTemplateView } from './models/my-templates-view.model';

@Component({
  selector: 'jd-my-templates',
  templateUrl: './my-templates.component.html',
  styleUrls: ['./my-templates.component.scss']
})
export class MyTemplatesComponent implements OnInit {

  // @Input() model: EndUserView;
  listModel : MyTemplateView[] = [];
  orderedlist:any;
  RacfId:any;
  page = 1;
  constructor(private cdr: ChangeDetectorRef , 
    private service: TemplatesService,
    private http: HttpClient,
    private router: Router,
    private userService:UserService) { }

  async ngOnInit(): Promise<void> {
    this.RacfId = this.userService.getRacfId()
    this.orderedlist=await this.service.getTemplates();
    if(this.orderedlist && this.orderedlist.data && this.orderedlist.data.content){
      this.listModel = await Promise.all(this.orderedlist?.data?.content.map((x: any) => MyTemplatesModelMapper.mapToViewModel(x)));
    }else{
      this.listModel = []
    }
    
    console.log(this.listModel,this.orderedlist)
  }

  handlePageChange(event) {
    this.page = event;
  }

}
