import { map } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataLoadParams, FilterSettings } from 'src/app/shared/components/data-table/models/data-table-model';
import { TemplateGalleryService } from '../../../services/template-gallery.service';
import { DOCUMENT } from '@angular/common';
import { DocumentTypeService } from '../../../services/doc-type.service';

@Component({
  selector: 'jd-image-galary',
  templateUrl: './image-galary.component.html',
  styleUrls: ['./image-galary.component.scss']
})
export class ImageGalaryComponent implements OnInit {
  config={id:'test', itemsPerPage: 12, currentPage: 1,totalItems:12 }
  ImageList:Array<{name:string;sorce:string;dimention?:any;base64ImagePath?:string}>=[{name:'Template',sorce:'../../../../assets/Template demo/template/2.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/4.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/5.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/7.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/8.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/9.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/7.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/8.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/template2_1.jpg',dimention:{width:1080,height:1920}},{name:'Template',sorce:'../../../../assets/Template demo/template/8.jpg',dimention:{width:1080,height:1080}},{name:'Template',sorce:'../../../../assets/Template demo/template/template2_3.png',dimention:{width:1080,height:1920}}];
  constructor(private templateGallerySR: TemplateGalleryService, @Inject(DOCUMENT) private document: Document, private cdr: ChangeDetectorRef,  private docService: DocumentTypeService, ) { }
  @Output() selected = new EventEmitter();
  @Output()  back = new EventEmitter();
  @Input() dimention ;
  listModel:any;
  params: DataLoadParams = {} as any;
  requestBody={}
  loading=false;
  @ViewChild('filterButton') filterButton: ElementRef;


  showFilterDialog = false;
  filterDialogTop = 0;
  filterDialogRight = 0;
  filterDialogWidth = 0;
  filterApplied: boolean = false;
  filters: FilterSettings[];
  async ngOnInit(): Promise<void> {
  let categories= await this.docService.getDocCategory();
  let options= [];
      categories.forEach(category=>{
        options.push(category);

    })
    console.log(options)
    this.filters= [

      {
        field: 'category',
        type: 'category',
        placeholder: 'Category',
        selectOptions:options
      },
      {
        field: 'subCategory',
        type: 'sub-category',
        placeholder: 'Sub-Category',
        //selectOptions: this.getMasterData('divisions')
      }
    ],
this.params.page =1;
this.params.size=12;
// this.params.searchKey ='jpg'
this.loading=true;
     this.ImageList = this.ImageList.filter(x=>x.dimention?.height ==this.dimention?.height && x.dimention?.width == this.dimention?.width)
      const res =await this.templateGallerySR.getAllImage(this.params,this.requestBody);
      console.log(res)
      if(res && res.data && res.data.content)
      {
        this.config.totalItems = res.data.totalElements;
        this.config.itemsPerPage = res.data.numberOfElements;
        this.ImageList =  res.data.content.map(x=>{
         return{ name:x.documentFileName,sorce:x?.imgSrc,base64ImagePath:x?.base64ImagePath}
        })
      }
      this.loading=false;
  }
  async selectIteam(iteam:{name:string,sorce:string;base64ImagePath:string;})
  {
    this.loading=true;
    const res:any = await this.templateGallerySR.getTemplatesBase64(iteam.base64ImagePath)
    console.log(res.body)
    let temp = iteam;
    temp.sorce ='data:image/jpeg;base64,'+res.body;
    this.loading=false;
  this.selected.emit(temp)
  }
  backToMain()
  {
    this.back.emit();
  }
  async handlePageChange(event)
  {
    this.loading=true;
   this.params.page  = event;
   const res =await this.templateGallerySR.getAllImage(this.params,this.requestBody);
      console.log(res)
      if(res && res.data && res.data.content)
      {
        this.config.currentPage =  this.params.page;
        this.config.totalItems = res.data.totalElements;
        this.config.itemsPerPage = res.data.size;
        this.ImageList =  res.data.content.map(x=>{
          return{ name:x.documentFileName,sorce:x?.imgSrc,base64ImagePath:x?.base64ImagePath}
        })
      }
      this.loading=false;
  }
  redirectToImage(event:string)
  {

    this.document.location.href = event;
  }
  onFilterClick()
  {
    this.filterDialogTop = (this.filterButton.nativeElement.offsetTop + this.filterButton.nativeElement.offsetHeight);
    let filterDialogOffsetRight = (this.filterButton.nativeElement.offsetLeft + this.filterButton.nativeElement.offsetWidth);
    this.filterDialogRight = window.innerWidth - filterDialogOffsetRight;
    this.filterDialogWidth = filterDialogOffsetRight - this.filterButton.nativeElement.offsetLeft;
    this.showFilterDialog = !this.showFilterDialog;
    this.cdr.detectChanges();
  }

  onCloseFilter(){
    this.showFilterDialog = false;
   // this.dataTable.onCloseFilter();
    this.filterApplied = false;
  }

  async onFilterCallback(options:FilterSettings[]){
   console.log(options)
   if(options)
   {
    this.requestBody['categoryList'] = options.find(x=>x.field == 'category').value;
    this.requestBody['subCategoryList'] = options.find(x=>x.field == 'subCategory').value;
   }
   this.loading=true;
   const res =await this.templateGallerySR.getAllImage(this.params,this.requestBody);
   console.log(res)
   this.requestBody['categoryList'] = [];
   this.requestBody['subCategoryList'] = [];
   if(res && res.data && res.data.content)
   {
     this.config.totalItems = res.data.totalElements;
     this.config.itemsPerPage = res.data.numberOfElements;
     this.ImageList =  res.data.content.map(x=>{
      return{ name:x.documentFileName,sorce:x?.imgSrc,base64ImagePath:x?.base64ImagePath}
     })
   }
   this.loading=false;

    this.showFilterDialog = !this.showFilterDialog;
  }

  async onFilterUpdated(value: boolean){
    console.log(value)
    this.loading=true;
    const res =await this.templateGallerySR.getAllImage(this.params,this.requestBody);
    console.log(res)
    if(res && res.data && res.data.content)
    {
      this.config.totalItems = res.data.totalElements;
      this.config.itemsPerPage = res.data.numberOfElements;
      this.ImageList =  res.data.content.map(x=>{
       return{ name:x.documentFileName,sorce:x?.imgSrc,base64ImagePath:x?.base64ImagePath}
      })
    }
    this.loading=false;
    this.filterApplied = value;
  }
}
