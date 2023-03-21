import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { number } from 'echarts';
import { fabric } from 'fabric';

var that ;
@Component({
  selector: 'jd-edit-image-collge',
  templateUrl: './edit-image-collge.component.html',
  styleUrls: ['./edit-image-collge.component.scss']
})
export class EditImageCollgeComponent implements OnInit {
  scalingProperties :{
    'left': number,
    'top': number,
    'scale': number
  };
  public showImageGalary=false;
  private contextCanvas:any;
  public selectedDetails:{lock:string,displayName:string;index:number};

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  fabricLayerCanvasObject:fabric.Canvas;
  ObjectInstanceArray =[];
  // imageListOfLoadingTemplate=[{name:2,sorce:'../../../../assets/Template demo/template/6.jpg',lock:true,displayName:'Logo'},{name:0,sorce:'../../../../assets/Template demo/template/2.jpg',lock:false,displayName:'Photo'},{name:1,sorce:'../../../../assets/Template demo/template/5.jpg',lock:false,displayName:'Yellow Green'}];
  imageListOfLoadingTemplate=[{name:1,sorce:'../../../../assets/Template demo/template/7.jpg',lock:false,displayName:'Image 1',left:30,top:30},{name:2,sorce:'../../../../assets/Template demo/template/2.jpg',lock:false,displayName:'Image 2',left:410,top:30}];
  @Output() public closed = new EventEmitter<void>();
  public font_type =[[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}]];
  public colorText1: string="#367c2b" ;
  public colorText2: string="White" ;
  public textAllowColor =['transparent','#FFFFFF','#367c2b','#ffde00','#bab994','#333333','#ffb000','#e5e6e6','#717a80','#fff494','#a3ae58']
  fontOptions=[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'},{id: 'JDSansPro-Bold' ,name:'JDSansPro-Bold'},{id: 'Noto Sans' ,name:'Noto Sans'}]
  fontSize : Array<number> =[] as any;
  @ViewChild('layerForm', { static: false }) form: NgForm;
  objectClick=false;
  widthOfCanvas;
  canvasHeight=0;
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit()
  {

    this.widthOfCanvas= document.getElementById('canvasContainer').offsetWidth;
   this.canvasHeight =document.getElementById('canvasContainer').offsetHeight;

    that =this;
    this.fabricLayerCanvasObject = new fabric.Canvas('canvasEditTemplate',{ preserveObjectStacking: true,renderOnAddRemove:true });
    this.fabricLayerCanvasObject.setWidth(this.widthOfCanvas);
    this.fabricLayerCanvasObject.backgroundColor =  '#e5e6e6';
    this.preventObjectMovingOutisideTheCanvas();
    this.initLoadImage();
   // document.querySelector('.upper-canvas ')
   // .addEventListener('mouseup', (options:any)=>{
// if(!that.objectClick)
//   that.deselectCanvas();

   //   }

 // });
    // document.querySelector('.upper-canvas ')
    // .addEventListener('click', (e:any)=>{
    //   var objectFound = false;
    //   var clickPoint = new fabric.Point(e.offsetX, e.offsetY);

    //   e.preventDefault();

    //   that.fabricLayerCanvasObject.forEachObject(function (obj) {
    //       if (!objectFound && obj.containsPoint(clickPoint)) {
    //           objectFound = true;
    //           //TODO: whatever you want with the object
    //       }
    //   });
    //   console.log(objectFound)
    //   console.log("sdf")

    // });
    // this.fabricLayerCanvasObject.on('mouse:down', function(options) {
    //   console.log('canvas event');

    //   that.fabricLayerCanvasObject.bringForward( that.ObjectInstanceArray[0].imageimstants);
    // console.log(  that.ObjectInstanceArray[0].imageimstants)
    // });
  }
  selectedImage(event)
  {
    this.deselectCanvas()
    this.showImageGalary = false;
    console.log(event)
    const imageInstance  = this.ObjectInstanceArray[this.selectedDetails?.index].imageimstants.getBoundingRect()
    let ob ={sorce:event.sorce,lock:this.selectedDetails?.lock,displayName:this.selectedDetails?.displayName}
    this.addImageOnCanvas(ob,this.selectedDetails?.index,imageInstance.left,imageInstance.top,imageInstance.height)
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
      this.addTextOnCanvas((this.widthOfCanvas/2)-100,this.fabricLayerCanvasObject.height-100,this.font_type[0][0].name,this.colorText1,"Input your text...",3,22,"Text1");
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
        hasRotatingPoint: false,
       // lockUniScaling :false,

        lockRotation: true,
        angle: 0,
        hasBorders : true,
        opacity: 1,
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
        image.scaleToWidth((this.widthOfCanvas/2)-(this.widthOfCanvas/7));
      // }
        this.extend(image, this.randomId());
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
  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }
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
      this.extend(image, this.randomId());
      this.fabricLayerCanvasObject.insertAt(image,index,true);
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
if(this.ObjectInstanceArray[_index].type=="text")
return
    this.ObjectInstanceArray.forEach((element,index) => {
      if(index ==_index)
      {
        element.imageimstants.opacity = 1;
      }
      else
      {
        element.imageimstants.opacity = 0;
      }
    });
    this.fabricLayerCanvasObject.renderAll();
  }
  selectAll()
  {

    this.ObjectInstanceArray.forEach((element,index) => {

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
  saveImage() {
    this.deselectCanvas();
    console.log(this.ObjectInstanceArray[4])
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'abc.net/files/test.ino';
    link.download = "photo.png";
    document.body.appendChild(link);

    link.href =  this.fabricLayerCanvasObject.toDataURL({
      format: 'png',
      quality: 1,
      multiplier:4
  });   // Save all combined images to one image

    link.click();
    link.remove();

  }
  close()
  {
    this.closed.emit();
  }
  addTextOnCanvas(_left:number,_top:number,_fontFamily:string,_colorText:string,_textContent:string,_position:number,_fontSize:number,_displayName:string)
  {

//     var RectWithText = fabric.util.createClass(fabric.Rect, {
//       type: 'rectWithText',
//       text: null,
//       textOffsetLeft: 0,
//       textOffsetTop: 0,
//       _prevObjectStacking: null,
//       _prevAngle: 0,

//       recalcTextPosition: function () {
//         const sin = Math.sin(fabric.util.degreesToRadians(this.angle))
//         const cos = Math.cos(fabric.util.degreesToRadians(this.angle))
//         const newTop = sin * this.textOffsetLeft + cos * this.textOffsetTop
//         const newLeft = cos * this.textOffsetLeft - sin * this.textOffsetTop
//         const rectLeftTop = this.getPointByOrigin('left', 'top')
//         this.text.set('left', rectLeftTop.x + newLeft)
//         this.text.set('top', rectLeftTop.y + newTop)
//       },

//       initialize: function (rectOptions, textOptions, text) {
//         this.callSuper('initialize', rectOptions)
//         this.text = new fabric.Textbox(text, {
//           ...textOptions,
//           selectable: false,
//           evented: false,
//         })
//         this.textOffsetLeft = this.text.left - this.left
//         this.textOffsetTop = this.text.top - this.top
//         this.on('moving', () => {
//           this.recalcTextPosition()
//         })
//         this.on('rotating', () => {
//           this.text.rotate(this.text.angle + this.angle - this._prevAngle)
//           this.recalcTextPosition()
//           this._prevAngle = this.angle
//         })
//         this.on('scaling', (e) => {
//           this.recalcTextPosition()
//         })
//         this.on('added', () => {
//           this.canvas.add(this.text)
//         })
//         this.on('removed', () => {
//           this.canvas.remove(this.text)
//         })
//         this.on('mousedown:before', () => {
//           this._prevObjectStacking = this.canvas.preserveObjectStacking
//           this.canvas.preserveObjectStacking = true
//         })
//         this.on('mousedblclick', () => {
//           this.text.selectable = true
//           this.text.evented = true
//           this.canvas.setActiveObject(this.text)
//           this.text.enterEditing()
//           this.selectable = false
//         })
//         this.on('deselected', () => {
//           this.canvas.preserveObjectStacking = this._prevObjectStacking
//         })
//         this.text.on('editing:exited', () => {
//           this.text.selectable = false
//           this.text.evented = false
//           this.selectable = true
//         })
//       }
//   })

//   const rectOptions = {
//     left: 10,
//     top: 10,
//     width: 400,
//     height: 400,
//     fill: '',
//   }
//   const textOptions = {
//     left: 35,
//     top: 30,
//     width: 150,
//     fill: 'white',
//     // shadow: new fabric.Shadow({
//     //   color: 'rgba(34, 34, 100, 0.4)',
//     //   blur: 2,
//     //   offsetX: -2,
//     //   offsetY: 2
//     // }),
//     fontSize: 30,
//   }
//   const rectWithText = new RectWithText(rectOptions, textOptions, 'Some text')
//   rectWithText.text.fill ="red";
// console.log(rectWithText.text.fill)
  //canvas.add(rectWithText)


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
      fontSize:_fontSize

    });
    this.fontSize[_position] = _fontSize;
    this.fabricLayerCanvasObject.insertAt(text,_position,true);
    this.ObjectInstanceArray[_position]={imageimstants:text,lock:false,displayName:_displayName,type:'text'};
  }
  handleColorChange(_event,_color,_index)
  {
    console.log(_event,_color,_index)
    if(_index == 3)
    {
      this.colorText1 = _color;
    this.ObjectInstanceArray[_index].imageimstants.set({

         fill:_color
      });

    console.log(this.ObjectInstanceArray[_index].imageimstants.fill)
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
if(_index == 3)
{
  this.ObjectInstanceArray[_index].imageimstants.set({

    fontFamily: event[0]?.name
  });
}
else if(_index == 4)
{
  this.ObjectInstanceArray[_index].imageimstants.set({

    fontFamily: event[0]?.name
  });
}
this.fabricLayerCanvasObject.renderAll()
  }
  setFontSize(_Value,_index)
  {

    if(_index == 3)
    {

    this.ObjectInstanceArray[_index].imageimstants.set({

      fontSize:_Value
      })
    }
    else if(_index == 4)
    {
      this.ObjectInstanceArray[_index].imageimstants.set({

        fontSize:_Value
        })
    }
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



  _setScalingProperties(left, top, scale) {
    if(this.scalingProperties == null
    || this.scalingProperties['scale'] > scale) {
      this.scalingProperties = {
        'left': left,
        'top': top,
        'scale': scale
      };
    }
  }
 deselectCanvas()
 {
  this.fabricLayerCanvasObject.discardActiveObject().renderAll();
 }
 bgColorChange(_event,_color,_index)
 {
  this.fabricLayerCanvasObject.backgroundColor =  _color;
   console.log(_event,_color,_index)

    this.fabricLayerCanvasObject.renderAll()

 }
}

