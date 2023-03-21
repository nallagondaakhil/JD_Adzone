import { Component, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';
import { TemplatesService } from '../../../services/templates.service';
@Directive({
  selector: '[resizeDiloag]',
})
export class ResizableTextAreaDirective {
  @Output() resize = new EventEmitter();

  width: number;
  height: number;

  mouseMoveListener: Function;

  @HostListener('mousedown', ['$event.target'])
  onMouseDown(el) {
    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
    this.mouseMoveListener = this.renderer.listen(
      'document',
      'mousemove',
      () => {
        if (this.width !== el.offsetWidth || this.height !== el.offsetHeight) {
          this.resize.emit({ width: el.offsetWidth, height: el.offsetHeight });
        }
      }
    );
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.ngOnDestroy();
  }

  constructor(private renderer: Renderer2) {}

  ngOnDestroy() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }
  }
}
let getPropertyValue = function (style, prop) {
  let value = style.getPropertyValue(prop);
  value = value ? value.replace(/[^0-9.]/g, "") : "0";
  return parseFloat(value);
};

let getElementRect = function (element) {
  let style = window.getComputedStyle(element, null);
  return {
    x: getPropertyValue(style, "left"),
    y: getPropertyValue(style, "top"),
    width: getPropertyValue(style, "width"),
    height: getPropertyValue(style, "height")
  };
};

var that ;
// var img01URL = '../../../../assets/Template demo/template/template2_1.jpg';
// var img02URL = 'http://fabricjs.com/lib/pug.jpg';
@Component({
  selector: 'jd-edit-image-collages',
  templateUrl: './edit-image-collages.component.html',
  styleUrls: ['./edit-image-collages.component.scss']
})
export class EditImageCollagesComponent implements OnInit {
  scalingProperties :{
    'left': number,
    'top': number,
    'scale': number
  };
  titile ="Collage"
  imageListOfLoadingTemplate=[{name:1,sorce:'../../../../assets/Template demo/template/7.jpg',lock:false,displayName:'Image 1',left:30,top:30},{name:2,sorce:'../../../../assets/Template demo/template/2.jpg',lock:false,displayName:'Image 2',left:410,top:30}];
  public showImageGalary=false;
  private contextCanvas:any;
  public selectedDetails:{lock:string,displayName:string;index:number};
  image1Url = '../../../../assets/Template demo/template/template2_1.jpg';
  image2Url= '../../../../assets/Template demo/template/2.jpg';
  image3Url= '../../../../assets/Template demo/template/4.jpg';
  typeOneLayoutImages = [ 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB3CAYAAAA5Od+KAAAABHNCSVQICAgIfAhkiAAAAqxJREFUeF7t3bFOwwAUQ1G69v9/NV1B6grDlSondrjMD8fxGTrmcRzH95d/t1zgIe4tXd8vJe59bcW9sa24/w73+Xze+Z1v+W6v1+vXe/35myvunr+4e2a4sbh4qr1DcffMcGNx8VR7h+LumeHG4uKp9g7F3TPDjcXFU+0dirtnhhuLi6faOxR3zww3FhdPtXco7p4ZbiwunmrvUNw9M9xYXDzV3qG4e2a4sbh4qr1DcffMcGNx8VR7h+LumeHG4uKp9g7F3TPDjcXFU+0dirtnhhuLi6faOxR3zww3FhdPtXco7p4ZbiwunmrvUNw9M9xYXDzV3qG4e2a4sbh4qr1DcffMcGNx8VR7h+LumeHG4uKp9g7F3TPDjcXFU+0dirtnhhuLi6faOxR3zww3FhdPtXco7p4ZbiwunmrvUNw9M9xYXDzV3qG4e2a4sbh4qr1DcffMcGOMixM9rF7Aj0ZV83xWTtzP9qv+bz89U83Dy+HfXL8rxEdtuRS3RSLQQ9zAqC2R4rZIBHqIGxi1JVLcFolAD3EDo7ZEitsiEeghbmDUlkhxWyQCPcQNjNoSKW6LRKCHuIFRWyLFbZEI9BA3MGpLpLgtEoEe4gZGbYkUt0Ui0EPcwKgtkeK2SAR6iBsYtSVS3BaJQA9xA6O2RIrbIhHoIW5g1JZIcVskAj3EDYzaEilui0Sgh7iBUVsixW2RCPQQNzBqS6S4LRKBHuIGRm2JFLdFItBD3MCoLZHitkgEeogbGLUlUtwWiUAPcQOjtkSK2yIR6CFuYNSWSHFbJAI9xA2M2hIpbotEoIe4gVFbIsVtkQj0EDcwakukuC0SgR7iBkZtiRS3RSLQQ9zAqC2R4rZIBHpg3MCzjbxgAT89c8HoZz1S3LOWvuA54l4w+lmPFPespS94zg8naQrXHxx60QAAAABJRU5ErkJggg==','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB3CAYAAAA5Od+KAAAABHNCSVQICAgIfAhkiAAAAjxJREFUeF7t2cFqwzAQBNDkmv//VeeaQkhLoQXDYBh5/XptJytp89ZKet+27XXzM/IE7po7sq/vTWnu3N5q7uDeau7lmvt4PMbt+fl8/uxp+v6+N/rvM3f65qfvT3OHzabfk0lzNXfOCXjmfno5/Zk0fX/G8pyh9N6JZ+5FJhO55M45AReqi4wtF6o5aP9cODRXc091Am7LF3nsuC2fyuX+Yskl93abfuGYvj9jeX/SneovjGVj2Vg+FdnPYskll1xyT3YC/nFwkbHlo9DJZO4tl1xy994jy/7ebfkib17fUC1rMFsYueT6nJvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkkpvZ6abIJZfcrsGsOrnkZu8cqfVO4L5t22u9ZVnRESeguUec4qKvobmLNuaIZWnuEae46Gt8AW5wWubINjQyAAAAAElFTkSuQmCC']
  typeOneLayoutImages2 = [ 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB3CAAAAAAcUoBWAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmBxoNAgsscRGNAAAAXUlEQVRo3u3SsQ0AIBADMfbflxqm+CAR3wJubu03LW7QPcm4XC6Xy+VyuVwul8vlfu3m63TbvuJyuVwul8vlcrlcLpc75+brdNu+4nK5XC6Xy+VyuVwulzvn5uNmuurSssKPknohAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA3LTI2VDEzOjAxOjU2KzAwOjAwC2gAwgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wNy0yNlQxMzowMTo1NiswMDowMHo1uH4AAAAASUVORK5CYII=','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB3CAYAAAA5Od+KAAAABHNCSVQICAgIfAhkiAAAAtpJREFUeF7t17FOG0AYBOHQ8v6vardEShGlQEK7+guv81FzlpnRDXsfj8fj65eftyTwQe5bev3zR5H7vm7JfWO35P5Xcj8/P1/m730+n3+/i+/1s5Z/eX37PxfEDOKr8iL3Z4/f/sZCUcgltyRwcGzhhshyKZrcDJxBlfHyP/eA1yxEWS7ty3IGTpYzXrNF8RQqRS8UhVxySwIHxxZuiEFViiY3A2dQZbwMqgNesxBlubQvyxk4Wc54zRbFU6gUvVAUcsktCRwcW7ghBlUpmtwMnEGV8TKoDnjNQpTl0r4sZ+BkOeM1WxRPoVL0QlHIJbckcHBs4YYYVKVocjNwBlXGy6A64DULUZZL+7KcgZPljNdsUTyFStELRSGX3JLAwbGFG2JQlaLJzcAZVBkvg+qA1yxEWS7ty3IGTpYzXrNF8RQqRS8UhVxySwIHxxZuiEFViiY3A2dQZbwMqgNesxBlubQvyxk4Wc54zRbFU6gUvVAUcsktCRwcW7ghBlUpmtwMnEGV8TKoDnjNQpTl0r4sZ+BkOeM1WxRPoVL0QlHIJbckcHBs4YYYVKVocjNwBlXGy6A64DULUZZL+7KcgZPljNdsUTyFStELRSGX3JLAwbGFG2JQlaLJzcAZVBkvg+qA1yxEWS7ty3IGTpYzXrNF8RQqRS8UhVxySwIHxxZuiEFViiY3A2dQZbwMqgNesxBlubQvyxk4Wc54zRbFU6gUvVAUcsktCRwcW7ghBlUpmtwMnEGV8TKoDnjNQpTl0r4sZ+BkOeM1WxRPoVL0QlHIJbckcHBs4YYYVKVocjNwBlXGy6A64DULUZZL+7KcgZPljNdsUTyFStELRSGX3JLAwbGFG2JQlaLJzcAZVBkvg+qA1yxEWS7ty3IGTpYzXrNF8RQqRS8UhVxySwIHxxZuyNSgOnDiI16EwMfj8fh6ke/iaxwTIPcY6Ct9HLmvZOP4u5B7DPSVPu43GhKh9VUV4rIAAAAASUVORK5CYII=']
  @ViewChild('canvas1') canvas1: ElementRef<HTMLCanvasElement>;
  fabricLayerCanvasObject:fabric.Canvas;
  ObjectInstanceArray =[];
  public font_type =[[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}],[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}],[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}],[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}],[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}],[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}],[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}]];
  widthOfCanvas;
  canvasHeight=0;
  public colorText1: string="#367c2b" ;
  public colorText2: string="White" ;
  @Output() public closed = new EventEmitter<void>();
  fontSize : Array<number> =[] as any;
  fontOptions=[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'},{id: 'JDSansPro-Bold' ,name:'JDSansPro-Bold'},{id: 'Noto Sans' ,name:'Noto Sans'}]
  public textAllowColor =['transparent','#FFFFFF','#367c2b','#ffde00','#bab994','#333333','#ffb000','#e5e6e6','#717a80','#fff494','#a3ae58']
   width;
  height;
  disableText=false
  typeSelected=1
  @Input() typeSelectedMain=1
  textIndex=6;
  backGroundColorSelected="#FFFFFF"
  loading=false;

  constructor(private service: TemplatesService) { }

  ngOnInit(): void {
    fabric.Object.prototype.objectCaching = false;

  }
ngAfterViewInit()
  {


    this.widthOfCanvas= document.getElementById('canvasContainer').offsetWidth;
   this.canvasHeight =document.getElementById('canvasContainer').offsetHeight;

    that =this;

    this.fabricLayerCanvasObject = new fabric.Canvas('canvasEditTemplate1',{ preserveObjectStacking: true,renderOnAddRemove:true });
    this.fabricLayerCanvasObject.setWidth(this.widthOfCanvas);
    this.fabricLayerCanvasObject.backgroundColor =  '#FFFFFF';
    this.ObjectInstanceArray[0]={imageimstants:'',lock:false,displayName:'Choose Layout',type:'layout'};
    this.ObjectInstanceArray[1]={imageimstants:'',lock:false,displayName:'Background',type:'background'};
    this.loadImageFrame(this.typeSelected,this.typeSelectedMain);
    if(this.typeSelectedMain==2)
    {
      this.textIndex =8
    }
    this.addTextOnCanvas((this.widthOfCanvas/2)-100,this.fabricLayerCanvasObject.height-100,this.font_type[0][0].name,this.colorText1,"Input your text...",this.textIndex,22,"Text1",false);

  }

  selectedImage(event)
  {
    this.deselectCanvas()
    this.showImageGalary = false;
    console.log(event)
    const imageInstance  = this.ObjectInstanceArray[this.selectedDetails?.index].imageimstants.getBoundingRect()
    let ob ={sorce:event.sorce,lock:this.selectedDetails?.lock,displayName:this.selectedDetails?.displayName}
   // this.addImageOnCanvas(ob,this.selectedDetails?.index,imageInstance.left,imageInstance.top,imageInstance.height)
if(this.typeSelectedMain==1)
{
  if(this.selectedDetails?.index ==3)
  {
   this.image1Url =event.sorce;
   if(this.typeSelected==1)
   {
     this.addImageWithClipPath(event.sorce,2,3,8,10,(this.widthOfCanvas/2)-15,this.canvasHeight-25,'Image 1')

   }
   else{
     this.addImageWithClipPath(this.image1Url,2,3,8,10,(this.widthOfCanvas)-20,(this.canvasHeight/2)-17,'Image 1')

   }


  }
  else{
   this.image2Url =event.sorce;
   if(this.typeSelected==1)
   {
   this.addImageWithClipPath(event.sorce,4,5,3 +this.widthOfCanvas/2,10,(this.widthOfCanvas/2)-15,this.canvasHeight-25,'Image 2')
   }
   else{
     this.addImageWithClipPath(this.image2Url,4,5,8,(this.canvasHeight/2)+3,(this.widthOfCanvas)-20,(this.canvasHeight/2)-17,'Image 2')
   }
  }
}
else{


  switch(this.typeSelected)
  {
    case 0:
      switch (this.selectedDetails?.index) {
        case 3:
          this.image1Url =event.sorce;
          this.addImageWithClipPath(event.sorce,2,3,8,10,(this.widthOfCanvas)-20,(this.canvasHeight/3)-17,'Image 1')


          break;
        case 5:
          this.image2Url =event.sorce;
          this.addImageWithClipPath(event.sorce,4,5,8,(this.canvasHeight/3)+3,(this.widthOfCanvas)-20,(this.canvasHeight/3)-10,'Image 2')

          break;
        case 7:
          this.image3Url =event.sorce;
          this.addImageWithClipPath(event.sorce,6,7,8,(this.canvasHeight/3)+(this.canvasHeight/3)+3,(this.widthOfCanvas)-20,(this.canvasHeight/3)-17,'Image 3')
          break;

      }
    break;
    case 1:
      switch (this.selectedDetails?.index) {
        case 3:
          this.image1Url =event.sorce;
          this.addImageWithClipPath(event.sorce, 2, 3, 8, 10, (this.widthOfCanvas / 3) - 15, this.canvasHeight - 25, 'Image 1')

          break;
        case 5:
          this.image2Url =event.sorce;
          this.addImageWithClipPath(event.sorce, 4, 5, 3 + this.widthOfCanvas / 3, 10, (this.widthOfCanvas / 3) - 10, this.canvasHeight - 25, 'Image 2')
          break;
        case 7:
          this.image3Url =event.sorce;
          this.addImageWithClipPath(event.sorce, 6, 7, 3 + (this.widthOfCanvas / 3) + this.widthOfCanvas / 3, 10, (this.widthOfCanvas / 3) - 15, this.canvasHeight - 25, 'Image 3')
          break;

      }
      break;
  }


}


  }
  showImageGalaryIteam()
  {
    this.showImageGalary = true;
  }
  async initLoadImage()
  {
    this.imageListOfLoadingTemplate.sort((a,b)=> a.name -b.name)

    //const result = await this.firstFunction()
    this.ObjectInstanceArray[0]={imageimstants:'',lock:false,displayName:'Background',type:'background'};
      this.imageListOfLoadingTemplate.map( (element,index) => {
      const contents =  this.addImageOnCanvas(element,element?.name,this.widthOfCanvas-(this.widthOfCanvas/(index+1))+(this.widthOfCanvas/15),element?.top,270)
      console.log(contents)
    });

      // console.log(this.ObjectInstanceArray[2].imageimstants.aCoords.bl.y)
      // let top1 =this.ObjectInstanceArray[2].imageimstants.top +( (this.ObjectInstanceArray[2].imageimstants.aCoords.bl.y)/5)
      // let top2 =this.ObjectInstanceArray[2].imageimstants.top +( (this.ObjectInstanceArray[2].imageimstants.aCoords.bl.y)/2)+( (this.ObjectInstanceArray[2].imageimstants.aCoords.bl.y)/5)
      // let left1 =this.ObjectInstanceArray[2].imageimstants.left+( (this.ObjectInstanceArray[2].imageimstants.aCoords.br.x)/7)
      // let left2 =this.ObjectInstanceArray[2].imageimstants.left+20
      this.addTextOnCanvas((this.widthOfCanvas/2)-100,this.fabricLayerCanvasObject.height-100,this.font_type[0][0].name,this.colorText1,"Input your text...",this.textIndex,22,"Text1",false);
    //  this.addTextOnCanvas(left2,top2,this.font_type[0][0].name,this.colorText2,"Input your text... \n Company Name \n ContactNumber \n Address or other Information",4,15,"Text2");
      console.log( this.imageListOfLoadingTemplate)


  //  await Promise.all(  this.imageListOfLoadingTemplate.forEach(element => {
  //     this.addImageOnCanvas(element,element?.name)
  //   });
   // console.log('Promise resolved: ' + result)

  }
   async addImageOnCanvas(element,_index,_left,_top,_scaleHeight=200) {

    if (element) {


          fabric.Image.fromURL(element.sorce, (image) => {
        image.set({
          left: _left,
        top: _top,
       // hasRotatingPoint: false,
       // lockUniScaling :false,

        // lockRotation: true,
        // angle: 0,
        // hasBorders : true,
        // opacity: 1,
       // selectable:true,
        });
      //   image.setControlsVisibility({
      //     mt: false,
      //     mb: false,
      //     ml: false,
      //     mr: false,
      //     bl: true,
      //     br: true,
      //     tl: true,
      //     tr: true,
      //     mtr: true,
      // });
       // image.scaleToWidth(1000);
      //  if(this.widthOfCanvas>550)
      //  {
      //   image.scaleToHeight(_scaleHeight);
      //  }
      //  else
      //  {
       // image.scaleToWidth((this.widthOfCanvas/2)-(this.widthOfCanvas/7));
      // }
       // this.extend(image, this.randomId());
        image.center();  // Centers object vertically and horizontally on canvas to which is was added last
        image.centerV(); // Centers object vertically on canvas to which it was added last
        image.centerH(); //
        image.setCoords();
        this.fabricLayerCanvasObject.insertAt(image,_index,true);
        this.fabricLayerCanvasObject.renderAll()
        // var obj:any = image;
        // // if object is too big ignore
        // if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        //   return;
        // }
        // obj.setCoords();
        // // top-left  corner
        // if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        //   obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        //   obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
        // }
        // // bot-right corner
        // if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        //   obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        //   obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
        // }
        this.fabricLayerCanvasObject.renderAll()
        //this.fabricLayerCanvasObject.centerObject(image);
        this.ObjectInstanceArray[_index]={imageimstants:image,lock:element.lock,displayName:element?.displayName,type:'image'};

      });

    }
  }
  //  firstFunction() {
  //   return new Promise((resolve, reject) => {
  //       let y = 0
  //       setTimeout(() => {
  //         this.imageListOfLoadingTemplate.forEach(element => {
  //     this.addImageOnCanvas(element,element?.name)
  //   });
  //         for (let i=0; i<10; i++) {
  //            y++
  //         }
  //          console.log('Loop completed.')
  //        //  resolve( this.ObjectInstanceArray)
  //       }, 2000)
  //   })
  // }
  // extend(obj, id) {
  //   obj.toObject = ((toObject) => {
  //     return function() {
  //       return fabric.util.object.extend(toObject.call(this), {
  //         id
  //       });
  //     };
  //   })(obj.toObject);
  // }
  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }
  chageImage(iteam,index)
  {
    fabric.Image.fromURL('../../../../assets/Template demo/template/4.jpg', (image) => {
      image.set({
        left: 0,
      top: 0,
      hasRotatingPoint: false,
      lockUniScaling :true,
      lockRotation: true,
      angle: 0,
      hasBorders : true,
      opacity: 1,
      selectable:false,
      });
      image.scaleToWidth(1000);
      image.scaleToHeight(400);
     // this.extend(image, this.randomId());
      this.fabricLayerCanvasObject.add(image);
      this.ObjectInstanceArray[index]=image;
    });
  }
  zoomInCanvas()
  {
    this.fabricLayerCanvasObject.setZoom(this.fabricLayerCanvasObject.getZoom() * 1.1 ) ;
    this.fabricLayerCanvasObject.renderAll();
  }
  zoomOutCanVas()
  {
    this.fabricLayerCanvasObject.setZoom(this.fabricLayerCanvasObject.getZoom() / 1.1 ) ;
    this.fabricLayerCanvasObject.renderAll();
  }
  moveToRigthCanvas()
  {
    var units = 10 ;
    var delta = new fabric.Point(units,0) ;
    this.fabricLayerCanvasObject.relativePan(delta) ;
    this.fabricLayerCanvasObject.renderAll();
  }
  moveToLeftCanvas()
  {
    var units = 10 ;
    var delta = new fabric.Point(-units,0) ;
    this.fabricLayerCanvasObject.relativePan(delta) ;
    this.fabricLayerCanvasObject.renderAll();
  }
  moveToUpCanvas()
  {
    var units = 10 ;
    var delta = new fabric.Point(0,-units) ;
    this.fabricLayerCanvasObject.relativePan(delta) ;
    this.fabricLayerCanvasObject.renderAll();
  }
  moveToDownCanvas()
  {
    var units = 10 ;
    var delta = new fabric.Point(0,units) ;
    this.fabricLayerCanvasObject.relativePan(delta) ;
    this.fabricLayerCanvasObject.renderAll();
  }
  selectImage(_index)
  {
    this.deselectCanvas();
if(this.ObjectInstanceArray[_index].type=="text"||this.ObjectInstanceArray[_index].type=="layout" ||this.ObjectInstanceArray[_index].type=="background")
return
    this.ObjectInstanceArray.forEach((element,index) => {
      if(index ==_index && element.imageimstants)
      {
        element.imageimstants.opacity = 1;
      }
      else if(element.imageimstants)
      {
        element.imageimstants.opacity = 0;
      }
    });
    this.fabricLayerCanvasObject.renderAll();
  }
  selectAll()
  {

    this.ObjectInstanceArray.forEach((element,index) => {
if(element?.type!='layout' && element?.type && element?.type!='background')
        element.imageimstants.opacity = 1;

    });
    this.fabricLayerCanvasObject.renderAll();
  }
  chooseImage(_index)
  {
    this.deselectCanvas();
    this.showImageGalary=true;
    this.selectedDetails={index:_index,displayName: this.ObjectInstanceArray[_index].displayName,lock:this.ObjectInstanceArray[_index].lock};
  }
  async saveImage() {
    this.loading=true;
   // this.deselectCanvas();
   // console.log(this.ObjectInstanceArray[4])
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'abc.net/files/test.ino';
    link.download = "photo.png";
    document.body.appendChild(link);
    let href = this.fabricLayerCanvasObject.toDataURL({
      quality: 1,
      multiplier: 2,
      enableRetinaScaling: true,

    });
    // console.log(href)
    link.href = href  // Save all combined images to one image
    let data = { fullName: 'photo.png', imageBase64: href, extension: 'png' };
   await this.service.onDownload(data);
    link.click();
    link.remove();
    this.loading=false;
  }
  close()
  {
    this.closed.emit();
  }
  addTextOnCanvas(_left:number,_top:number,_fontFamily:string,_colorText:string,_textContent:string,_position:number,_fontSize:number,_displayName:string,_visible:boolean)
  {

    const text = new fabric.IText(_textContent, {
      left: _left,
      top: _top,
      fontFamily:_fontFamily,
      angle: 0,
      fill: _colorText,
      scaleX: 1,
      scaleY: 1,
      hasControls: false,
      lockMovementX: false,
      lockMovementY: false,
      borderColor: 'yellow',
      selectable: true,
      borderDashArray:[7,6],
      fontSize:_fontSize,
      visible:_visible
    });
    this.fontSize[_position] = _fontSize;
    this.fabricLayerCanvasObject.insertAt(text,_position,true);
    this.ObjectInstanceArray[_position]={imageimstants:text,lock:false,displayName:_displayName,type:'text'};
  }
  handleColorChange(_event,_color,_index)
  {
    console.log(_event,_color,_index)
    if(_index == this.textIndex)
    {
      this.colorText1 = _color;
    this.ObjectInstanceArray[_index].imageimstants.set({

         fill:_color
      });

      console.log(this.ObjectInstanceArray[_index].imageimstants.get('text'))


    // console.log(this.ObjectInstanceArray[_index].imageimstants.fill)
this.fabricLayerCanvasObject.renderAll()
    }
    else if(_index == 4){
      this.colorText2 = _color;
      this.ObjectInstanceArray[_index].imageimstants.set({

        fill:_color
     });
     this.fabricLayerCanvasObject.renderAll()
    }
  }
  fontChange(event,_index)
  {
    if(event?.legth)
console.log(event,_index)
//console.log(_index)
if(_index == this.textIndex)
{
  this.ObjectInstanceArray[_index].imageimstants.set({

    fontFamily: event[0]?.name
  });
}
// else if(_index == 4)
// {
//   this.ObjectInstanceArray[_index].imageimstants.set({

//     fontFamily: event[0]?.name
//   });
// }
this.fabricLayerCanvasObject.renderAll()
  }
  setFontSize(_Value,_index)
  {

    if(_index == this.textIndex)
    {

    this.ObjectInstanceArray[_index].imageimstants.set({

      fontSize:_Value
      })
    }
    // else if(_index == 4)
    // {
    //   this.ObjectInstanceArray[_index].imageimstants.set({

    //     fontSize:_Value
    //     })
    // }
    this.fabricLayerCanvasObject.renderAll()
  }

  preventObjectMovingOutisideTheCanvas()
  {
    // this.fabricLayerCanvasObject.on('object:moving', function (e: any) {
    //   console.log("dafdf")
    //   console.log(e?.target?.get('type'))
    //   if(e?.target?.get('type')=="image")
    //   {

    //   var obj = e.target;
    //   // if object is too big ignore
    //   if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
    //     return;
    //   }
    //   obj.setCoords();
    //   // top-left  corner
    //   if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
    //     obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
    //     obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    //   }
    //   // bot-right corner
    //   if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
    //     obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
    //     obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
    //   }
    // }
    // });




    var left1 = 0;
    var top1 = 0;
    var scale1x = 0;
    var scale1y = 1;
    var width1 = 0;
    var height1 = 0;
    // this.fabricLayerCanvasObject.on('mouse:down', (e)=>{
    //   that.objectClick =true;
    //   console.log(e)
    // });
    // this.fabricLayerCanvasObject.on('mouse:up', (e)=>{
    //   that.objectClick =false;
    //   console.log(e)
    // });
  //   this.fabricLayerCanvasObject.on('object:modified', (e) => this._handleScaling(e));
  //   $('.canvas-container').bind('contextmenu', function (e) {
  //     var objectFound = false;
  //     var clickPoint = new fabric.Point(e.offsetX, e.offsetY);

  //     e.preventDefault();

  //     that.fabricLayerCanvasObject.forEachObject(function (obj) {
  //         if (!objectFound && obj.containsPoint(clickPoint)) {
  //             objectFound = true;
  //             //TODO: whatever you want with the object
  //         }
  //     });
  //     console.log(objectFound)
  // });
    // this.fabricLayerCanvasObject.on('mouseup', function(options) {

    //   if(options?.target?.get('type'))
    //   {

    //   }
    //   else{
    //     that.fabricLayerCanvasObject.discardActiveObject().renderAll();
    //   }
    //   console.log(options?.target?.get('type'))
    // });
    // this.fabricLayerCanvasObject.on('object:scaling', function (e) {
    //   var obj = e.target;
    //   obj.setCoords();
    //   var brNew = obj.getBoundingRect();
    //   if (((brNew.width+brNew.left)>=obj.canvas.width) || ((brNew.height+brNew.top)>=obj.canvas.height) || ((brNew.left<0) || (brNew.top<0))) {
    //     obj.left = left1;
    //     obj.top=top1;
    //     obj.scaleX=scale1x;
    //     obj.scaleY=scale1y;
    //     obj.width=width1;
    //     obj.height=height1;
    //   }
    //     else{
    //       left1 =obj.left;
    //       top1 =obj.top;
    //       scale1x = obj.scaleX;
    //       scale1y=obj.scaleY;
    //       width1=obj.width;
    //       height1=obj.height;
    //     }
    // });
  }
  // _handleScaling(e) {
  //   if(e.target.get('type')=="image")
  //   {

  //   var obj = e.target;
  //   var brOld = obj.getBoundingRect();
  //   obj.setCoords();
  //   var brNew = obj.getBoundingRect();
  //     // left border
  // // 1. compute the scale that sets obj.left equal 0
  // // 2. compute height if the same scale is applied to Y (we do not allow non-uniform scaling)
  // // 3. compute obj.top based on new height
  // if(brOld.left >= 0 && brNew.left < 0) {
  //   let scale = (brOld.width + brOld.left) / obj.width;
  //   let height = obj.height * scale;
  //   let top = ((brNew.top - brOld.top) / (brNew.height - brOld.height) *
  //     (height - brOld.height)) + brOld.top;
  //   this._setScalingProperties(0, top, scale);
  // }
  //   // top border
  //   if(brOld.top >= 0 && brNew.top < 0) {
  //     let scale = (brOld.height + brOld.top) / obj.height;
  //     let width = obj.width * scale;
  //     let left = ((brNew.left - brOld.left) / (brNew.width - brOld.width) *
  //       (width - brOld.width)) + brOld.left;
  //     this._setScalingProperties(left, 0, scale);
  //   }
  //   // right border
  //   if(brOld.left + brOld.width <= obj.canvas.width
  //   && brNew.left + brNew.width > obj.canvas.width) {
  //     let scale = (obj.canvas.width - brOld.left) / obj.width;
  //     let height = obj.height * scale;
  //     let top = ((brNew.top - brOld.top) / (brNew.height - brOld.height) *
  //       (height - brOld.height)) + brOld.top;
  //     this._setScalingProperties(brNew.left, top, scale);
  //   }
  //   // bottom border
  //   if(brOld.top + brOld.height <= obj.canvas.height
  //   && brNew.top + brNew.height > obj.canvas.height) {
  //     let scale = (obj.canvas.height - brOld.top) / obj.height;
  //     let width = obj.width * scale;
  //     let left = ((brNew.left - brOld.left) / (brNew.width - brOld.width) *
  //       (width - brOld.width)) + brOld.left;
  //     this._setScalingProperties(left, brNew.top, scale);
  //   }

  // if(brNew.left < 0
  //   || brNew.top < 0
  //   || brNew.left + brNew.width > obj.canvas.width
  //   || brNew.top + brNew.height > obj.canvas.height) {
  //     obj.left = this.scalingProperties['left'];
  //     obj.top = this.scalingProperties['top'];
  //     obj.scaleX = this.scalingProperties['scale'];
  //     obj.scaleY = this.scalingProperties['scale'];
  //     obj.setCoords();
  //   } else {
  //     this.scalingProperties = null;
  //   }
  // }
  // }



  // _setScalingProperties(left, top, scale) {
  //   if(this.scalingProperties == null
  //   || this.scalingProperties['scale'] > scale) {
  //     this.scalingProperties = {
  //       'left': left,
  //       'top': top,
  //       'scale': scale
  //     };
  //   }
  // }
 deselectCanvas()
 {
  this.fabricLayerCanvasObject.discardActiveObject().renderAll();
 }
 bgColorChange(_event,_color,_index)
 {
  this.backGroundColorSelected =_color;
  this.fabricLayerCanvasObject.backgroundColor = this.backGroundColorSelected;
   console.log(_event,_color,_index)

    this.fabricLayerCanvasObject.renderAll()

 }
 myFunction()
 {


  const newWidth =  document.getElementById('canvasContainer').clientWidth
  const newHeight =  document.getElementById('canvasContainer').clientHeight
  if (newWidth !== this.width || newHeight !== this.height) {
    this.fabricLayerCanvasObject.clear();
    this.width = newWidth
    this.height = newHeight
    this.fabricLayerCanvasObject.setWidth(newWidth)
    this.fabricLayerCanvasObject.setHeight(newHeight)

    this.loadImageFrame(this.typeSelected,this.typeSelectedMain);
    this.fabricLayerCanvasObject.renderAll()
  }

 }
 loadImageFrame(type:number,mainType=1)
 {
  this.widthOfCanvas= document.getElementById('canvasContainer').offsetWidth;
  this.canvasHeight =document.getElementById('canvasContainer').offsetHeight;
  if(mainType==1)
  {
    switch(type)
    {
      case 0:
      this.addImageWithClipPath(this.image1Url,2,3,8,10,(this.widthOfCanvas)-20,(this.canvasHeight/2)-17,'Image 1')
      this.addImageWithClipPath(this.image2Url,4,5,8,(this.canvasHeight/2)+3,(this.widthOfCanvas)-20,(this.canvasHeight/2)-17,'Image 2')
      break;
      case 1:

        this.addImageWithClipPath(this.image1Url,2,3,8,10,(this.widthOfCanvas/2)-15,this.canvasHeight-25,'Image 1')
        this.addImageWithClipPath(this.image2Url,4,5,3 +this.widthOfCanvas/2,10,(this.widthOfCanvas/2)-15,this.canvasHeight-25,'Image 2')
        // var clipPath2 = new fabric.Rect({
        //   width:(this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 10,
        //   absolutePositioned: true,
        // });
        // var clipPath3 = new fabric.Rect({
        //   width:(this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 10,
        //   absolutePositioned: true,
        //   backgroundColor:'rgb(227, 226, 226)',
        //   fill: "",
        //   stroke: 'rgb(148, 147, 147)',
        //   strokeWidth: 2,
        //   selectable:false
        // });
        // that.fabricLayerCanvasObject.add(clipPath3);
        // var logoImg = new Image();
        // logoImg.onload = function (img) {
        //     var logo = new fabric.Image(logoImg, {
        //         angle: 0,
        //         top:10,
        //         left:10,
        //         hasControls: false,
        //         lockMovementX: false,
        //         lockMovementY: true,

        //     });
        //     logo.scaleToHeight(529)
        //     if( logo.getBoundingRect().width<((that.widthOfCanvas/2)-15))
        //     {
        //       logo.scaleToWidth((that.widthOfCanvas/2)-15)
        //       logo.lockMovementX =true
        //       logo.lockMovementY =false
        //     }
        //     logo.clipPath =clipPath2
        //    that.fabricLayerCanvasObject.add(logo);

        // };
        // logoImg.src = img01URL;



        // var clipPath4 = new fabric.Rect({
        //   width: (this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 5 +this.widthOfCanvas/2,
        //   absolutePositioned: true,
        //   stroke: 'rgb(148, 147, 147)',
        //   strokeWidth: 2,
        // });

        // var clipPath5 = new fabric.Rect({
        //   width: (this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 5 +this.widthOfCanvas/2,
        //   absolutePositioned: true,
        //   backgroundColor:'rgb(227, 226, 226)',
        //   fill: "",
        //   stroke: 'rgb(148, 147, 147)',
        //   strokeWidth: 2,
        //   selectable:false

        // });
        // that.fabricLayerCanvasObject.add(clipPath5);
        // // clipPath2.hasBorders =true;
        // // clipPath2.hasRotatingPoint =true;
        // var logoImg2 = new Image();
        // logoImg2.onload = function (img) {
        //     var logo = new fabric.Image(logoImg2, {
        //         angle: 0,
        //         left:5 +that.widthOfCanvas/2,
        //         top:10,
        //         hasControls: false,
        //         lockMovementX: false,
        //         lockMovementY: true,

        //     });
        //     logo.scaleToHeight(529)
        //     if( logo.getBoundingRect().width<((that.widthOfCanvas/2)-15))
        //     {
        //       logo.scaleToWidth((that.widthOfCanvas/2)-15)
        //       logo.lockMovementX =true
        //       logo.lockMovementY =false
        //     }
        //     console.log( )
        //     logo.clipPath =clipPath4
        //    that.fabricLayerCanvasObject.add(logo);
        //     that.fabricLayerCanvasObject.renderAll()

        // };
        // logoImg2.src = img01URL;
        // fabric.Image.fromURL('../../../../assets/Template demo/template/7.jpg', (image) => {
        //   image.set({
        //     left: 0,
        //   top: 0,
        //  // hasRotatingPoint: false,
        //  // lockUniScaling :false,

        //   // lockRotation: true,
        //   // angle: 0,
        //   // hasBorders : true,
        //   // opacity: 1,
        //  // selectable:true,
        //   });

        //   // image.scaleToWidth((this.widthOfCanvas/2)-(this.widthOfCanvas/7));

        //   // image.center();  // Centers object vertically and horizontally on canvas to which is was added last
        //   // image.centerV(); // Centers object vertically on canvas to which it was added last
        //   // image.centerH(); //
        //   // image.setCoords();
        //   image.clipPath =clipPath4
        //   this.fabricLayerCanvasObject.insertAt(image,0,true);
        // })

        break;
    }
  }
  else{
    switch(type)
    {
      case 0:
      this.addImageWithClipPath(this.image1Url,2,3,8,10,(this.widthOfCanvas)-20,(this.canvasHeight/3)-17,'Image 1')
      this.addImageWithClipPath(this.image2Url,4,5,8,(this.canvasHeight/3)+3,(this.widthOfCanvas)-20,(this.canvasHeight/3)-10,'Image 2')
      this.addImageWithClipPath(this.image3Url,6,7,8,(this.canvasHeight/3)+(this.canvasHeight/3)+3,(this.widthOfCanvas)-20,(this.canvasHeight/3)-17,'Image 3')
      break;
      case 1:

        this.addImageWithClipPath(this.image1Url,2,3,8,10,(this.widthOfCanvas/3)-15,this.canvasHeight-25,'Image 1')
        this.addImageWithClipPath(this.image2Url,4,5,3 +this.widthOfCanvas/3,10,(this.widthOfCanvas/3)-10,this.canvasHeight-25,'Image 2')
        this.addImageWithClipPath(this.image3Url,6,7,3 +(this.widthOfCanvas/3)+this.widthOfCanvas/3,10,(this.widthOfCanvas/3)-15,this.canvasHeight-25,'Image 3')
        // var clipPath2 = new fabric.Rect({
        //   width:(this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 10,
        //   absolutePositioned: true,
        // });
        // var clipPath3 = new fabric.Rect({
        //   width:(this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 10,
        //   absolutePositioned: true,
        //   backgroundColor:'rgb(227, 226, 226)',
        //   fill: "",
        //   stroke: 'rgb(148, 147, 147)',
        //   strokeWidth: 2,
        //   selectable:false
        // });
        // that.fabricLayerCanvasObject.add(clipPath3);
        // var logoImg = new Image();
        // logoImg.onload = function (img) {
        //     var logo = new fabric.Image(logoImg, {
        //         angle: 0,
        //         top:10,
        //         left:10,
        //         hasControls: false,
        //         lockMovementX: false,
        //         lockMovementY: true,

        //     });
        //     logo.scaleToHeight(529)
        //     if( logo.getBoundingRect().width<((that.widthOfCanvas/2)-15))
        //     {
        //       logo.scaleToWidth((that.widthOfCanvas/2)-15)
        //       logo.lockMovementX =true
        //       logo.lockMovementY =false
        //     }
        //     logo.clipPath =clipPath2
        //    that.fabricLayerCanvasObject.add(logo);

        // };
        // logoImg.src = img01URL;



        // var clipPath4 = new fabric.Rect({
        //   width: (this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 5 +this.widthOfCanvas/2,
        //   absolutePositioned: true,
        //   stroke: 'rgb(148, 147, 147)',
        //   strokeWidth: 2,
        // });

        // var clipPath5 = new fabric.Rect({
        //   width: (this.widthOfCanvas/2)-15,
        //   height: this.canvasHeight-30,
        //   top: 10,
        //   left: 5 +this.widthOfCanvas/2,
        //   absolutePositioned: true,
        //   backgroundColor:'rgb(227, 226, 226)',
        //   fill: "",
        //   stroke: 'rgb(148, 147, 147)',
        //   strokeWidth: 2,
        //   selectable:false

        // });
        // that.fabricLayerCanvasObject.add(clipPath5);
        // // clipPath2.hasBorders =true;
        // // clipPath2.hasRotatingPoint =true;
        // var logoImg2 = new Image();
        // logoImg2.onload = function (img) {
        //     var logo = new fabric.Image(logoImg2, {
        //         angle: 0,
        //         left:5 +that.widthOfCanvas/2,
        //         top:10,
        //         hasControls: false,
        //         lockMovementX: false,
        //         lockMovementY: true,

        //     });
        //     logo.scaleToHeight(529)
        //     if( logo.getBoundingRect().width<((that.widthOfCanvas/2)-15))
        //     {
        //       logo.scaleToWidth((that.widthOfCanvas/2)-15)
        //       logo.lockMovementX =true
        //       logo.lockMovementY =false
        //     }
        //     console.log( )
        //     logo.clipPath =clipPath4
        //    that.fabricLayerCanvasObject.add(logo);
        //     that.fabricLayerCanvasObject.renderAll()

        // };
        // logoImg2.src = img01URL;
        // fabric.Image.fromURL('../../../../assets/Template demo/template/7.jpg', (image) => {
        //   image.set({
        //     left: 0,
        //   top: 0,
        //  // hasRotatingPoint: false,
        //  // lockUniScaling :false,

        //   // lockRotation: true,
        //   // angle: 0,
        //   // hasBorders : true,
        //   // opacity: 1,
        //  // selectable:true,
        //   });

        //   // image.scaleToWidth((this.widthOfCanvas/2)-(this.widthOfCanvas/7));

        //   // image.center();  // Centers object vertically and horizontally on canvas to which is was added last
        //   // image.centerV(); // Centers object vertically on canvas to which it was added last
        //   // image.centerH(); //
        //   // image.setCoords();
        //   image.clipPath =clipPath4
        //   this.fabricLayerCanvasObject.insertAt(image,0,true);
        // })

        break;
    }
  }
    this.fabricLayerCanvasObject.backgroundColor = this.backGroundColorSelected;
    this.fabricLayerCanvasObject.renderAll()
 }
  addImageWithClipPath(_imageUrl,_insert_IndexClipPath,_insert_Index,_imageLeft,_imgtop,_width,_height,_displayName)
  {
    var clipPath = new fabric.Rect({
      width:_width,
      height: _height,
      top: _imgtop,
      left: _imageLeft,
      absolutePositioned: true,
      backgroundColor: 'green',

    });
    var clipPathBorder = new fabric.Rect({
      width:_width,
      height: _height,
      top: _imgtop,
      left: _imageLeft,
      absolutePositioned: true,
      backgroundColor:'rgb(227, 226, 226)',
      fill: "",

      selectable:false
    });
    that.fabricLayerCanvasObject.insertAt(clipPathBorder,_insert_IndexClipPath,true);
    fabric.Image.fromURL(_imageUrl, (image) => {
            image.set({
              left: _imageLeft,
            top: _imgtop,
            hasControls: true,
            transparentCorners: false,
            cornerSize: 12,
            borderScaleFactor :2,
            borderDashArray:[6,7],
            borderColor:'#000000',
            cornerColor:'#000000'
            });
            image.scaleToHeight(_height)
            if( image.getBoundingRect().width<(_width))
            {
              image.scaleToWidth(_width)
              image.lockMovementX =true
              image.lockMovementY =false
            }
            else{
              image.lockMovementX =false
              image.lockMovementY =true
            }
            image.clipPath =clipPath;
            this.fabricLayerCanvasObject.insertAt(image,_insert_Index,true);
            this.ObjectInstanceArray[_insert_Index]={imageimstants:image,lock:false,displayName:_displayName,type:'image'};
           this.fabricLayerCanvasObject.renderAll()
          })

    }
    activationChange(event:any){
      console.log(event)
      this.disableText=event
      this.addTextOnCanvas((this.widthOfCanvas/2)-100,this.fabricLayerCanvasObject.height-100,this.font_type[0][0].name,this.colorText1,"Input your text...",this.textIndex,22,"Text1",event);
      this.fabricLayerCanvasObject.renderAll()
    }
    onChange(event:any)
    {
     // alert(event)
      this.typeSelected =event
      console.log(event)
      this.loadImageFrame(event,this.typeSelectedMain)
    }
    backGalary()
    {
      this.showImageGalary = false;
    }



}

