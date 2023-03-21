
import { UserService } from 'src/app/core/services/user.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'jd-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit {
  showEditPopUp=false;
  showCollagePopUp=false;
  image={};
  imageList=[];
  imageListTemplate2=[];
  imageList3=[];
  imageList2=[];
  isJDUser:boolean=false;
  dealerView=false;
  collageType=2;
  constructor( @Inject(DOCUMENT) private document: Document, private userService: UserService, private location:Location, private router:Router) {

  }

  ngOnInit(): void {
    this.imageList=[{name:'Template',sorce:'../../../../assets/icons/1.jpg',dimention:{width:1080,height:1080}}]
    this.imageListTemplate2=[{name:'Template2',sorce:'../../../../assets/icons/template2.jpg',dimention:{width:1080,height:1920}}]
    this.imageList2=[{name:'Collage',sorce:'../../../../assets/Template demo/collageImage.png'}]
    this.imageList3=[{name:'Collage',sorce:'../../../../assets/Template demo/collage3.jpg'}]
    this.isJDUser=this.userService.isJdUser();
    let result = JSON.parse(localStorage.getItem('dealerView'))
    this.dealerView = result;
  }
  editButtonClick(event:any)
  {
    this.image=event;
    this.showEditPopUp=true;
  }
  editCollageClick(event:any,type:number)
  {
    this. collageType=type;
    this.image=event;
    this.showCollagePopUp=true;
  }
  closeEditTemplate()
  {
    this.showEditPopUp=false;
  }
  closeEditCollage()
  {
    this.showCollagePopUp=false;
  }
  downloadTemplate(event:any)
  {
      if(event)
      {
        const a = document.createElement('a')
        a.download =  event.name;
        a.href = event.sorce;
        a.click()
      }
  }
  redirectToImage(event:string)
  {

    this.document.location.href = event;
  }

}
