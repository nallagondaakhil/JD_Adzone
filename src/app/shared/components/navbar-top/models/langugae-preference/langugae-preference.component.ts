import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { CommonSyncService } from 'src/app/shared/services/common-sync.Service';
import { ModalDialogService } from 'src/app/shared/services/modal-dialog.service';

@Component({
  selector: 'jd-langugae-preference',
  templateUrl: './langugae-preference.component.html',
  styleUrls: ['./langugae-preference.component.scss']
})
export class LangugaePreferenceComponent implements OnInit {
  title='';
  buttonText='';
  loading = false;
  @Output() closed = new EventEmitter();
  roleOptions: { id: string, name: string }[] = [];
  curentStatus: string;
  // @Input() model: DocumentCategoryView;
  @ViewChild('addeditdoccat', { static: false }) form: NgForm;
   saveedit="";
   isEdit: boolean;
   resticday=new Date()
   today=new Date();
   savepreference:boolean = false;
   apply:boolean = false;
   chooselang:boolean = true;
  userToken: string;
  languageData: any[]=[];
  preference: any;
  appliedLang:any;
  preferredLang: string;
  language:any
  
  constructor(
    private modalService: ModalDialogService,
    private masterservice:MasterDataService,
    private userService: UserService,
    public translate: TranslateService,
    public common:CommonSyncService
  ) { 
    this.appliedLang = localStorage.getItem('Applylanguage');
    this.preferredLang = localStorage.getItem('preferred');
    this.languageData = JSON.parse(localStorage.getItem('languageData'));
    this.userToken = this.userService.getRacfId();
    // this.language = this.masterservice.getLanguage(this.userToken);

    // setTimeout(()=>{
    //   this.initaldata(this.language);

    // },500)
  }

  ngOnInit(): void {
   
  }

  initaldata(language){                     
      this.languageData = language.__zone_symbol__value;
      console.log('laguga',this.languageData)
  }

  onClose(){
    this.closed.emit();
    // window.location.reload();
  }
  onApply(){
    this.apply = true;
    this.chooselang = false;
    this.savepreference = false;
    console.log('apply',this.preference)
    if(this.preference == 3){
      localStorage.setItem('Applylanguage','zh-cn');
      localStorage.setItem('userLangCode','zh-cn');
      this.translate.use('zh-cn');
      localStorage.removeItem('preLanguage');
      this.common.changeMessage('Chinese')
      // this.masterservice.setLanguage(this.userToken,this.preference);

    }
    else if(this.preference == 2){
      this.translate.use('en-gb');
      localStorage.setItem('Applylanguage','en-gb');
      localStorage.setItem('userLangCode','en-gb');
      localStorage.removeItem('preLanguage');
      this.common.changeMessage('English')

      // this.masterservice.setLanguage(this.userToken,this.preference);
     
    }

  }
  onsave(){
    this.apply = false;
    this.chooselang = false;
    this.savepreference = true;
    if(this.preference == 3){
      this.translate.use('zh-cn');
      this.masterservice.setLanguage(this.userToken,this.preference);
      localStorage.setItem('preLanguage','zh-cn');
      localStorage.setItem('userLangCode','zh-cn');
      localStorage.setItem('preferred','zh-cn');
      localStorage.removeItem('Applylanguage');
      setTimeout(()=>{
        this.userToken = this.userService.getRacfId();
        this.language = this.masterservice.getLanguage(this.userToken);
        console.log('this.language',this.language)
        this.common.changeMessage('Chinese')
      },500)
      
    }
    else if(this.preference == 2){
      this.translate.use('en-gb');
      this.masterservice.setLanguage(this.userToken,this.preference);
      localStorage.setItem('preLanguage','en-gb');
      localStorage.setItem('userLangCode','en-gb');
      localStorage.setItem('preferred','en-gb');
      localStorage.removeItem('Applylanguage');
      setTimeout(()=>{
        this.userToken = this.userService.getRacfId();
        this.language = this.masterservice.getLanguage(this.userToken);
        console.log('this.language',this.language)
        this.common.changeMessage('English')
      },500)
  
    }
    
  }
  changePreference(preference:any){
    console.log('preference',preference);
    this.preference = preference?.languageId;
  }
  onCloseApply(e:any){
    this.apply = false;
    this.onClose();
    // this.savepreference = false;
  }
  onCloseSave(e:any){
    // this.apply = false;
    this.savepreference = false;
    this.onClose();
    
  }
}
