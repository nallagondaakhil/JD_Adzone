import { Component, Input, OnInit, Output, EventEmitter, ElementRef,Renderer2 , ViewChild, HostListener } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from 'src/app/core/services/user.service';
import { MasterDataService } from 'src/app/modules/admin/services/master-data.service';
import { CommonSyncService } from '../../services/common-sync.Service';

@Component({
  selector: 'jd-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectListComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: SelectListComponent
    }
  ]
})

export class SelectListComponent implements OnInit, ControlValueAccessor, Validator {

  touched = false;
  dropdownSettings: {}={} as any;
  dropDownInit: boolean;
  value: any[]=[];

  @Input() label: string;
  @Input() displayProperty = 'name';
  @Input() valueProperty = 'value';
  @Input() itemSource: any[]=[];
  disable:any=false;
  pathArray: string[];
  userToken: any;
  @Input('disabled')  set disabled(value: boolean) {

    //console.log(value);
    this.disable=value;
    this.initializeSettings();

  }
  @Input() multiple = false;
  @Input() control: FormControl;
  @Input() enableSelectAll = true;
  @Input() enableSearch = true;
  @Input() markAsRequired: boolean;
  @Input() itemsShowLimit = 1;
  @Input() placeholder = 'Select';
  @Input() disabledLabel = false;
  @Output() valueChange: EventEmitter<any[]> = new EventEmitter();
  tooltip:any='';
  deviceInfo:any;
  isDesktopDevice:any;
  noDataAvailable:any = 'No Data Avaliable';
  searchAvaliable:any = 'Search';
  onChange = (val: any[]) => {
  // alert(this.placeholder)
  };
  onTouched = () => {};

  constructor( private masterservice:MasterDataService,private userService: UserService,
    private elementRef:ElementRef, private deviceService: DeviceDetectorService,
    public common:CommonSyncService) {
  }

  ngOnInit(): void {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
    
    this.userToken = this.userService.getRacfId();
    let language:any = this.masterservice.getLanguage(this.userToken);
    let languageData:any[]=[] ;
    languageData = language.__zone_symbol__value;
    let data = languageData.find((val:any)=> val.checked == true)
    this.pathArray = window.location.pathname.split('/');
    let applyReult = localStorage.getItem('Applylanguage')
    let preReult = localStorage.getItem('preLanguage')
    if(this.pathArray[2] == "end-user-management"){
      this.common.currentMessage.subscribe(async message => {
          console.log('message',message)
          // if(message){
          //   if( message == 'Chinese'){
            
          //     this.placeholder = '选择';
          //     this.noDataAvailable = '无可用数据',
          //     this.searchAvaliable = '搜索'
          //   }
          //   else if(message == 'English' ){
          //     console.log('englush')
          //     this.placeholder = 'Select';
          //     this.noDataAvailable = 'No Data Avaliable';
          //     this.searchAvaliable = 'Search'
          //   }
          // }
          if(applyReult){
            console.log('applyReult')
        
            if( applyReult == 'zh-cn'){
              console.log('chines')
              this.placeholder = '选择';
              this.noDataAvailable = '无可用数据',
              this.searchAvaliable = '搜索'
            }
            else if(applyReult == 'en-gb' ){
              console.log('englush')
        
              this.placeholder = 'Select';
              this.noDataAvailable = 'No Data Avaliable';
              this.searchAvaliable = 'Search'
            }
          }
          else if(preReult){
            // console.log('preReult')
            if( preReult == 'zh-cn'){
              console.log('chines')
              this.placeholder = '选择';
              this.noDataAvailable = '无可用数据',
              this.searchAvaliable = '搜索'
            }
            else if(preReult == 'en-gb' ){
              // console.log('englush')
        
              this.placeholder = 'Select';
              this.noDataAvailable = 'No Data Avaliable';
              this.searchAvaliable = 'Search'
            }
          }
    })
    
    this.initializeSettings();

    }
    else{
      this.initializeSettings();
    }

  
  }


  private initializeSettings() {
    this.dropdownSettings = {
      noDataLabel:this.noDataAvailable,
      stopScrollPropagation:true,
      singleSelection: !this.multiple,
      labelKey:this.displayProperty,
      primaryKey:this.valueProperty,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: this.enableSelectAll && this.multiple,
      badgeShowLimit: this.itemsShowLimit,
      allowSearchFilter: true,
      closeDropDownOnSelection: !this.multiple,
      text:this.placeholder,
      searchAutofocus:false,
      enableSearchFilter: true,
      searchPlaceholderText: this.searchAvaliable,
      searchBy:[this.displayProperty],
      showCheckbox:true,
      lazyLoading:false,
      maxHeight:130,
      escapeToClose:true,
      disabled:this.disable,
      autoPosition:  this.isDesktopDevice?false:true, 
      // position:'bottom',
       tagToBody: true
    };

   // this.elementRef.nativeElement.querySelector(".dropdown-list .item2").addEventListener("mousewheel", this.disableParentScroll.bind(this));
  //  this.elementRef.nativeElement.querySelector(".dropdown-list .item2").addEventListener("DOMMouseScroll", this.disableParentScroll.bind(this));

  }

   disableParentScroll(event: any) {
    const scrollable = this.elementRef.nativeElement.querySelector(".dropdown-list .item2");
    const deltaY = event.deltaY;
    const contentHeight = scrollable.scrollHeight;
    const visibleHeight = scrollable.offsetHeight;
    const scrollTop = scrollable.scrollTop;

    if (scrollTop === 0 && deltaY < 0)
        event.preventDefault();
    else if (visibleHeight + scrollTop === contentHeight && deltaY > 0)
        event.preventDefault();
  }

  dropdownClose() {
    // if (this.dropDownInit === undefined) {
    //   this.dropDownInit = true;
    //   const filterBox =  window.document.querySelector('.filter-textbox');
    //   filterBox.insertAdjacentHTML('beforeend', '<svg style="position: absolute; right: 8px" focusable="false" aria-hidden="true" fill="lightgray" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>');
    // }
  }

  onValueChange(value: any,val?:any) {

    if (value === undefined || value === null || value.length==0 ) { 
      // if(value.length == 0){
        console.log(value)
        let data =  localStorage.getItem('submenuValue')
        // console.log('naveena',data)
        if(data != 'Contact Us'){
        let result = JSON.parse(localStorage.getItem('fileType'));
        let resultSort = JSON.parse(localStorage.getItem('sortById'));
        let resultLang = JSON.parse(localStorage.getItem('language'));
        if(val[0]?.documentTypeId){
          if(val[0]?.documentTypeId == result[0]?.documentTypeId){
            localStorage.removeItem('fileType');
            localStorage.removeItem('page')
          }
        }
        if(val[0]?.sortId){
          if(val[0]?.sortId == resultSort[0]?.sortId){
            localStorage.removeItem('sortById')
            localStorage.removeItem('page')
          }
        }
        if(val[0]?.id && resultLang!= null){
          if(val[0]?.id == resultLang[0]?.id){
            localStorage.removeItem('language')
            localStorage.removeItem('page')
          }
        }
      }
      // }
      }
    this.value = value;
    this.tooltip= this.value?.map((x:any)=> x.name);
    this.onChange(value);
    // console.log(value,this.placeholder)
    this.valueChange.emit(value);
    
  }

  writeValue(val: any[]) {
    if (val === undefined || val === null ) { return; }
    if (val == this.value) { return; }
    this.value = val;
    this.tooltip= this.value?.map((x:any)=> x.name);
    // //console.log(val,this.placeholder);
    this.onValueChange(val);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  // setDisabledState(disabled: boolean) {
  //   this.disabled = disabled;
  // }

  validate(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    return null;
  }

  onKeyDown(e: any) {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  }

  onItemSelect(item:any){
    // //console.log(item,this.placeholder);
    // //console.log(this.value);
  //  this.renderer.removeStyle(this.getElementDropdown(), 'display')
}
OnItemDeSelect(item:any){
    //console.log(item);
    //console.log(this.value);
}
onSelectAll(items: any){
    //console.log(items);
}
onDeSelectAll(items: any){
    //console.log(items);

}
openDropdown(){
  // this.renderer.setStyle(this.getElementDropdown(), 'display', 'block');
  // console.log(this.getElementDropdown().offsetTop)
  }

  // private getElementDropdown(): HTMLElement{
  //  // return document.getElementsByClassName("dropdown-list")[0] as HTMLElement;
  // }


}
