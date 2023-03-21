import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
enum JDCollagetool {
  IMAGE = 'image',
  LAYOUT = 'layout',
  TEXT = 'text',
  BKG="background",
  NONE = 'none',

}
var that;
@Component({
  selector: 'jd-collage-image',
  templateUrl: './collage-image.component.html',
  styleUrls: ['./collage-image.component.scss']
})

export class CollageImageComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('photo') photo: ElementRef<HTMLCanvasElement>;
  name = 'Angular';
  fontOptions=[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'},{id: 'JDSansPro-Bold' ,name:'JDSansPro-Bold'},{id: 'Noto Sans' ,name:'Noto Sans'}]
  public font_type =[{id: 'JDSansPro-Medium' ,name:'JDSansPro-Medium'}];
  public isCollapsed = true;
  activeTool:JDCollagetool = JDCollagetool.NONE;
  toolType=JDCollagetool;
  private ctx: CanvasRenderingContext2D;
  public color: string ;
  public colorText: string ;
  public hue: string;
  public hueText : string;
  Layer =[];
  textLayer =[] as any;
  textContent =  'JOHN DEERE'
  public imageInstance={} as any;

  ImageList=[{name:'Template',sorce:'../../../../assets/Template demo/template/1.jpg'},{name:'Template',sorce:'../../../../assets/Template demo/template/2.jpg'},{name:'Template',sorce:'../../../../assets/Template demo/template/3.jpg'},{name:'Template',sorce:'../../../../assets/Template demo/template/4.jpg'},{name:'Template',sorce:'../../../../assets/Template demo/template/5.jpg'}];
  constructor() { }

    ngOnInit(): void {
      that =  this;
    this.ImageList.forEach(async element => {
      const bse64Image = await  this.getBase64ImageFromUrl(element.sorce);
    console.log(bse64Image)
    const  image2:any = new Image();
    image2.id = Math.random().toString(36).substr(2, 9);    // Generate image ID
    image2.height = 120;
    image2.width = 120;
    image2.style.padding = "10px 10px 10px 10px" ;
    image2.src = bse64Image;
    var output2 = document.querySelector('#images_preview');

      output2.appendChild(image2);
      image2.ondragstart = function (e) {  // Register drag event
          e.dataTransfer.setData("text", e.target.id);

              };
    });

  }
  ngAfterViewInit()
  {
    this.addLayer("gray",800,450,"50px","90px",true);
  // this.addLayer("gray",380,350,"50px","560px",true);
  // this.addTextLayer("transparent",850,70,"420px","90px");
  }
  setBackground() {
    if(this.activeTool == JDCollagetool.BKG)
  {
    this.activeTool = JDCollagetool.NONE;
  }
  else{
    this.activeTool = JDCollagetool.BKG
  }
    // if (!this.ctx) {
    //   this.ctx = this.canvas.nativeElement.getContext('2d');
    // }
    // const width = this.canvas.nativeElement.width;
    // const height = this.canvas.nativeElement.height;

    // this.ctx.clearRect(0, 0, width, height);

    // const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    // gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    // gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    // // gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    // // gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    // // gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    // // gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    // // gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    // this.ctx.beginPath();
    // this.ctx.rect(0, 0, width, height);

    // this.ctx.fillStyle = gradient;
    // this.ctx.fill();
    // this.ctx.closePath();

    // if (this.selectedHeight) {
    //   this.ctx.beginPath();
    //   this.ctx.strokeStyle = 'white';
    //   this.ctx.lineWidth = 5;
    //   this.ctx.rect(0, this.selectedHeight - 5, width, 10);
    //   this.ctx.stroke();
    //   this.ctx.closePath();
    // }
}
async  getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        resolve(reader.result);
    }, false);

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  })
}
ImageButtonClick()
{
  if(this.activeTool == JDCollagetool.IMAGE)
  {
    this.activeTool = JDCollagetool.NONE;
  }
  else{
    this.activeTool = JDCollagetool.IMAGE
  }
}
applayBaground()
{
  if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, this.color);
    this.textLayer[0].lowerCanvasEl.style.backgroundColor =  this.color;
    // gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    // gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    // gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    // gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    // gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    // gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();
    this.activeTool = JDCollagetool.NONE;

}
registerEvents(canvas) {
  canvas.upperCanvasEl.oncontextmenu =function (e) {
    alert("Adf")
   // console.log(e,this)
    if(canvas.getActiveObject())
    {
      console.log(canvas.getActiveObject())
    }
  }
  canvas.upperCanvasEl.ondragenter = function () {
      canvas.style.border = "dashed 4px yellow";  // Change the canvas borders when hovering
  };
  canvas.upperCanvasEl.ondragleave = function () {
      canvas.style.border = "none";    // Reset canvas borders when hovering is not active
  };
  canvas.upperCanvasEl.ondragover = function (e) {
      e.preventDefault();
  };
  canvas.upperCanvasEl.ondrop = function (e) {
    console.log(canvas)
      e.preventDefault();
      debugger
      var id = e.dataTransfer.getData("text");

      var dropImage:any = document.getElementById(id);
      canvas.upperCanvasEl.style.border = "none";              // Reset canvas borders after image drop

      var context = canvas.upperCanvasEl.getContext("2d");
     // context.drawImage(dropImage, 0, 0, canvas.width, canvas.height);     // Draw and stretch image to fill canvas
     var imgInstance = new fabric.Image(dropImage, {
      left: 20,
      top: 20,
      hasRotatingPoint: false,
      lockUniScaling :true,
      lockRotation: true,
      angle: 0,
      hasBorders : true,
      opacity: 1,
      selectable:true,

    });
    imgInstance.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mtr: false,
 });
    imgInstance.scaleToHeight(400);
    imgInstance.scaleToWidth(300);
    // canvas.getObjects().forEach((obj) => {
    //   canvas.remove(obj)
    // });
    // canvas.discardActiveObject().renderAll()
   var a= canvas.insertAt(imgInstance,canvas.getObjects()?.length,true);
console.log(a)
debugger

  };
}
addLayer(_bagroundColor:string,_width:number,_hieght:number,_topPixel:string,_leftPixel:string,_allowDropmage:boolean =false)
{
  var layer1 = document.createElement('canvas');
  layer1.className = "layer";
  //layer1.id ="rt"
 // layer1.style.backgroundColor = _bagroundColor;
 layer1.style.position ="absolute"
 layer1.width = _width;
 layer1.height = _hieght;
 layer1.style.top = _topPixel;
 layer1.style.left = _leftPixel;
 layer1.style.visibility = "visible";
 layer1.style.zIndex ='9999';
 layer1.style.position ="absolute"
 layer1.id = Math.random().toString(36).substr(2, 9);
 //layer1.backgroundColor = _bagroundColor;
  //var body = document.getElementById("photo");
  this.photo.nativeElement.appendChild(layer1);
  let canvas:any = new fabric.Canvas(layer1,{ preserveObjectStacking: true,renderOnAddRemove:true });
  canvas.wrapperEl.style.position ="absolute"
  canvas.wrapperEl.width = _width;
  canvas.wrapperEl.height = _hieght;
  canvas.wrapperEl.style.top = _topPixel;
  canvas.wrapperEl.style.left = _leftPixel;
  canvas.wrapperEl.style.visibility = "visible";
  canvas.wrapperEl.style.zIndex ='9999';
  canvas.wrapperEl.style.position ="absolute"
  canvas.wrapperEl.style.backgroundColor = _bagroundColor;
  //canvas.upperCanvasEl.style.backgroundColor = _bagroundColor;
console.log(canvas)
if(_allowDropmage)
{
  this.registerEvents(canvas);
}

  this.Layer.push(canvas)


  // // Adding Example Text here.
  // canvas.add(new fabric.Text('This text is added', {
  //   left: 10,
  //   top: 10,
  //   fontFamily: 'helvetica',
  //   angle: 0,
  //   fill: '#000000',
  //   scaleX: 0.5,
  //   scaleY: 0.5,
  //   fontWeight: '',
  //   hasRotatingPoint: true
  // }));
  // canvas.add(new fabric.Text('This text is added', {
  //   left: 10,
  //   top: 10,
  //   fontFamily: 'helvetica',
  //   angle: 0,
  //   fill: '#000000',
  //   scaleX: 0.5,
  //   scaleY: 0.5,
  //   fontWeight: '',
  //   hasRotatingPoint: true
  // }));
  // canvas.selectionBorderColor ='red';
  // Setting up  Background to dynamic generated Canvas
  // canvas.setBackgroundImage(
  //     `${element}`,
  //   ,
  //     {
  //         backgroundImageOpacity: 1,
  //         backgroundImageStretch: false,
  //     }
  // );
 // canvas.renderAll.bind(canvas)
}
addTextLayer(_bagroundColor:string,_width:number,_hieght:number,_topPixel:string,_leftPixel:string,_allowDropmage:boolean =false)
{
  var layer1 = document.createElement('canvas');
  layer1.className = "text-layer-jd";
  //layer1.id ="rt"
 // layer1.style.backgroundColor = _bagroundColor;
 layer1.style.position ="absolute"
 layer1.width = _width;
 layer1.height = _hieght;
 layer1.style.top = _topPixel;
 layer1.style.left = _leftPixel;
 layer1.style.visibility = "visible";
 layer1.style.zIndex ='9999';
 layer1.style.position ="absolute"
 //layer1.backgroundColor = _bagroundColor;
  //var body = document.getElementById("photo");
  this.photo.nativeElement.appendChild(layer1);
  let canvas:any = new fabric.Canvas(layer1);
  canvas.wrapperEl.style.position ="absolute"
  canvas.wrapperEl.width = _width;
  canvas.wrapperEl.height = _hieght;
  canvas.wrapperEl.style.top = _topPixel;
  canvas.wrapperEl.style.left = _leftPixel;
  canvas.wrapperEl.style.visibility = "visible";
  canvas.upperCanvasEl.style.zIndex ='99999';
  canvas.wrapperEl.style.position ="absolute"

  //canvas.upperCanvasEl.style.backgroundColor = _bagroundColor;
console.log(canvas)
if(_allowDropmage)
{
  this.registerEvents(canvas);
}

  this.textLayer.push(canvas)


  // // Adding Example Text here.
  // canvas.add(new fabric.Text('This text is added', {
  //   left: 10,
  //   top: 10,
  //   fontFamily: 'helvetica',
  //   angle: 0,
  //   fill: '#000000',
  //   scaleX: 0.5,
  //   scaleY: 0.5,
  //   fontWeight: '',
  //   hasRotatingPoint: true
  // }));
  // canvas.add(new fabric.Text('This text is added', {
  //   left: 10,
  //   top: 10,
  //   fontFamily: 'helvetica',
  //   angle: 0,
  //   fill: '#000000',
  //   scaleX: 0.5,
  //   scaleY: 0.5,
  //   fontWeight: '',
  //   hasRotatingPoint: true
  // }));
  // canvas.selectionBorderColor ='red';
  // Setting up  Background to dynamic generated Canvas
  // canvas.setBackgroundImage(
  //     `${element}`,
  //   ,
  //     {
  //         backgroundImageOpacity: 1,
  //         backgroundImageStretch: false,
  //     }
  // );
 // canvas.renderAll.bind(canvas)
}
download()
{

  var canvas3 = document.createElement('canvas');
    var context = canvas3.getContext("2d");
    canvas3.width = 1010;
    canvas3.height = 510;
    // this.Layer.forEach(element => {
    //   var ob =element.toCanvasElement();
    //   console.log(ob)
    //  if(ob)
    //  {
    //   var image:any = ob;
    //  // console.log($(this).find('canvas'))

    //   context.beginPath();      // Simulate CSS padding around images by drawing white  rectangles behind images on export
    //   context.rect((image.offsetLeft-10 ), (image.offsetTop+5 ), image.width-10,
    //   image.height-10);
    //   context.fillStyle = "white";
    //   context.fill();

    //   context.drawImage(image, (image.offsetLeft-15 ), (image.offsetTop ),
    //   (image.width ), (image.height ));
    //  }
    // });
    // this.Layer.forEach(element => {

    //   var image = element.toDataURL('image');

    //     context.beginPath();      // Simulate CSS padding around images by drawing white  rectangles behind images on export
    //     context.rect((image.offsetLeft-10 ), (image.offsetTop+5 ), image.width-10,
    //     image.height-10);
    //     context.fillStyle = "white";
    //     context.fill();

    //     context.drawImage(image, (image.offsetLeft-15 ), (image.offsetTop ),
    //     (image.width ), (image.height ));
    // });
    // //We need to get all images droped on all canvases and combine them on above canvas
    var image:any = document.getElementById('background');
    console.log($(this).find('canvas'),image.offsetTop)

    context.beginPath();      // Simulate CSS padding around images by drawing white  rectangles behind images on export
    context.rect((image.offsetLeft ), (image.offsetTop ), image.offsetWidth,
    image.height);
    context.fillStyle = "white";
    context.fill();

    context.drawImage(image, (image.offsetLeft ), (image.offsetTop ),
    (image.offsetWidth ), (image.height ));    // Draw image

    $('#photo').children('div').each(function () {
        var image:any = $(this).find('canvas')[0];
        console.log($(this).find('.text-layer-jd'))
        //console.log($(this).find('canvas'),this.offsetTop)

        context.beginPath();
        // Simulate CSS padding around images by drawing white  rectangles behind images on export
        if($(this).find('.text-layer-jd')?.length ==0)
        {
          context.rect((this.offsetLeft ), (this.offsetTop ), image.offsetWidth,
          image.clientHeight);
          context.fillStyle = "white";
          context.fill();
        }


        context.drawImage(image, (this.offsetLeft ), (this.offsetTop ),
        (image.offsetWidth ), (image.clientHeight ));    // Draw image
    });
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'abc.net/files/test.ino';
    link.download = "photo.png";
    document.body.appendChild(link);

    link.href = canvas3.toDataURL();   // Save all combined images to one image

    link.click();
    link.remove();
        // Download the image
}
setText(event:any)
{

  const text = new fabric.IText(this.textContent, {
    left: 10,
    top: 10,
    fontFamily: this.font_type[0].name,
    angle: 0,
    fill: this.colorText,
    scaleX: 0.5,
    scaleY: 0.5,
    fontWeight: '',
    hasRotatingPoint: true
  });

  this.textLayer[0].add( text );

}
textButtonClick()
{
  if(this.activeTool == JDCollagetool.TEXT)
  {
    this.activeTool = JDCollagetool.NONE;
  }
  else{
    this.activeTool = JDCollagetool.TEXT
  }

}
clickOut()
{

 this.activeTool =  JDCollagetool.NONE;
}
}
