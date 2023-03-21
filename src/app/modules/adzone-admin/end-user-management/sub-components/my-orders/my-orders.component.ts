import { Options } from '@angular-slider/ngx-slider';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { IndependentcomponentserviceService } from 'src/app/shared/services/independentcomponentservice.service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';
import { OrdercomponentService } from 'src/app/shared/services/ordercomponent.service';
import { EndUserService } from '../../../services/end-user.service';
import { DataLoadParams } from 'src/app/shared/components/data-table/models/data-table-model';
import { EndUserModelMapper, EndUserView } from '../../models/end-user-view.model';
import { observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jd-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  @Input() model: EndUserView;
  listModel : EndUserView[] = [];
  orderedlist:any;
  RacfId:any;
  page = 1;
  currentpage:any;
  pageOfItems: any[];
  loading = false;
  currentIndex: number = -1;
  config={id:'test', itemsPerPage: 10, currentPage: 1,totalItems:10 }
  params: DataLoadParams={page: 1,size: 10,sort:'desc' };
  requestBody:any;
  constructor(private cdr: ChangeDetectorRef ,    
    private modalService: ModalDialogService,
    private alertService: AlertsService,
    private service: EndUserService,
    private intcompservice:IndependentcomponentserviceService,
    private orderService:OrdercomponentService,
    private http: HttpClient,
    private router: Router,
    private userService:UserService,
    public translate:TranslateService) {
      let appliedLang = localStorage.getItem('Applylanguage')
      let preLang = localStorage.getItem('preLanguage')
      if(appliedLang){
        this.translate.use(appliedLang);
      }
      else if(preLang){
        this.translate.use(preLang);
      }
     }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.RacfId = this.userService.getRacfId()
      this.orderService.currentMessage1.subscribe(async message1 => {
       console.log(message1)
        if(message1.lastNDays == 60){
          this.params = {page: 1,size: 10, };
          this.config.currentPage = 1;
          this.orderedlist=await this.service.getAllMyOrder(message1,this.params);
          this.config.totalItems=this.orderedlist.data.totalElements;

        }else if(message1.lastNDays == 30){
          this.params = {page: 1,size: 10, };
          this.config.currentPage = 1;
          this.orderedlist=await this.service.getAllMyOrder(message1,this.params);
          this.config.totalItems=this.orderedlist.data.totalElements;

        }else if(message1.lastNDays == "All"){
          message1.lastNDays = null;
          this.params = {page: 1,size: 10, };
          this.config.currentPage = 1;
          this.orderedlist=await this.service.getAllMyOrder(message1,this.params);
          this.config.totalItems=this.orderedlist.data.totalElements;

        }else if(message1.orderStatusList == null){
          this.params = {page: 1,size: 10, };
          this.config.currentPage = 1; 
      if(message1.length==0){return}
      this.orderedlist=await this.service.getAllMyOrder(message1,this.params);
      this.config.totalItems=this.orderedlist.data?.totalElements;
      if( this.orderedlist &&  this.orderedlist.data &&  this.orderedlist.data.content){
      this.listModel = await Promise.all(this.orderedlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null,'order')));
      this.loading = false;
      }else if(this.orderedlist.data == null){
      this.loading = false;
      }
      //this.handlePageChange(1);
    }
    })
      
  
  }
  goToDetailedScreen(selectedModel:any){
    this.router.navigate(['/master/detailed-view/'+selectedModel?.documentId+'/'+selectedModel?.documentFileId]);
  }

  async pageChanged(event:any)
  {
    this.params.page=event;
    this.config.currentPage=event;
    this.orderService.currentMessage1.subscribe(async message1 => {
      if(message1.length==0){return}
      this.orderedlist=await this.service.getAllMyOrder(message1,this.params);
      //this.config.totalItems=this.orderedlist.data.totalElements;
      if( this.orderedlist &&  this.orderedlist.data &&  this.orderedlist.data.content)
      this.listModel = await Promise.all(this.orderedlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null,'order')));
//this.loading = false;
    // if (!res || !res.data || !res.data.content) {
      
    // }
    else
    {
      this.config.totalItems=this.orderedlist.data.totalElements;
      this.listModel = await Promise.all(this.orderedlist?.data?.content.map((x: any) => EndUserModelMapper.mapToViewModel(x,null,'order')));
     
    }
  })
}

}

