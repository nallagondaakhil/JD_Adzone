import { element } from 'protractor';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { NgForm } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TemplatesService } from '../../../services/templates.service';
var that;
@Component({
  selector: 'jd-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent implements OnInit {
  public showImageGalary = false;
  private contextCanvas: any;
  public selectedDetails: { lock: string, displayName: string; index: number };
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  fabricLayerCanvasObject: fabric.Canvas;
  ObjectInstanceArray = [];
  imageListOfLoadingTemplate = [{ name: 5, sorce: '../../../../assets/Template demo/template/6.jpg', lock: true, displayName: 'Logo' }, { name: 0, sorce: '../../../../assets/Template demo/template/2.jpg', lock: false, displayName: 'Image 1' }, { name: 1, sorce: '../../../../assets/Template demo/template/5.jpg', lock: false, displayName: 'Image 2' }];
  imageListOfLoadingTemplate2 = [{ name: 5, sorce: '../../../../assets/Template demo/template/6.jpg', lock: true, displayName: 'Logo' }, { name: 0, sorce: '../../../../assets/Template demo/template/template2_1.jpg', lock: false, displayName: 'Image 1' }, { name: 1, sorce: '../../../../assets/Template demo/template/template2_3.png', lock: false, displayName: 'Image 2' }];
  @Output() public closed = new EventEmitter<void>();
  public font_type = [[{ id: 'JDSansPro-Medium', name: 'JDSansPro-Medium' }], [{ id: 'JDSansPro-Medium', name: 'JDSansPro-Medium' }], [{ id: 'JDSansPro-Medium', name: 'JDSansPro-Medium' }], [{ id: 'JDSansPro-Medium', name: 'JDSansPro-Medium' }], [{ id: 'JDSansPro-Medium', name: 'JDSansPro-Medium' }]];
  public colorText1: string = "black";
  public colorText2: string = "White";
  public colorText3: string = "black";
  public textAllowColor = ['#FFFFFF', '#367c2b', '#ffde00', '#bab994', '#333333', '#ffb000', '#e5e6e6', '#717a80', '#fff494', '#a3ae58']
  fontOptions = [{ id: 'JDSansPro-Medium', name: 'JDSansPro-Medium' }, { id: 'JDSansPro-Bold', name: 'JDSansPro-Bold' }, { id: 'Noto Sans', name: 'Noto Sans' }]
  fontSize: Array<number> = [] as any;
  fontText: Array<number> = [] as any;
  @ViewChild('layerForm', { static: false }) form: NgForm;
  widthOfCanvas;
  canvasHeight = 0;
  initwidthOfCanvas;
  initcanvasHeight = 0;
  rightleftPoint = 0;
  updownPoint = 0;
  @Input() dimention;
  @Input() titile = "Template";
  loading = false;
  disableText = false;
  showConvertText = false;
  public selected_Language = [{ id: 1, name: 'English' }]
  LanguageOptions = [{ id: 1, name: 'English', value: 'We run so life can leap forward' }, { id: 2, name: 'Chinese', value: '一鹿奔腾 生活跃升' }, { id: 3, name: 'Dutch', value: 'Wij rennen zodat het leven de sprong voorwaarts kan maken' }, { id: 4, name: 'Finnish', value: 'Teemme työtä edistyksen eteen' }, { id: 5, name: 'French', value: 'Nous travaillons pour que la vie progresse' }, { id: 6, name: 'German', value: 'Wir arbeiten, damit das Leben Fortschritte macht' }, { id: 7, name: 'Hindi', value: 'हम मेहनत से काम करते हैं, ताकि ज़िंदगी बेहतर बने' }, { id: 8, name: 'Italian', value: 'Ci impegniamo affinché la vita possa fare un balzo in avanti' }, { id: 9, name: 'Japanese', value: '飛躍を目指して懸命に努力する' }, { id: 10, name: 'Polish', value: 'Działamy dla poprawy jakości życia' }, { id: 11, name: 'Portuguese', value: 'Trabalhamos para que a vida possa avançar' }, { id: 12, name: 'Russian', value: 'Мы работаем, чтобы жизнь могла продолжаться' }, { id: 13, name: 'Spanish', value: 'Trabajamos para que la vida dé un salto hacia adelante' }, { id: 14, name: 'Swedish', value: 'Vi arbetar hårdare för att kunna ta jättekliv framåt' }, { id: 15, name: 'Thai', value: 'เราดำ เนินธุรกิจเพื่อนำ ชีวิตให้ก้าวกระโดดไปข้างหน้า' }, { id: 16, name: 'Turkish', value: 'Hayatı ileriye taşımak için çalışıyoruz' }]
  constructor(private service: TemplatesService) { }

  ngOnInit(): void {
    // fabric.Object.prototype.objectCaching = false;
  }
  ngAfterViewInit() {
    this.widthOfCanvas = document.getElementById('canvasContainer').offsetWidth;
    this.canvasHeight = document.getElementById('canvasContainer').offsetHeight;
    this.initcanvasHeight = this.canvasHeight;
    this.initwidthOfCanvas = this.widthOfCanvas
    that = this;
    this.fabricLayerCanvasObject = new fabric.Canvas('canvasEditTemplate', { preserveObjectStacking: true, renderOnAddRemove: true, centeredScaling: true });
    this.fabricLayerCanvasObject.setWidth(this.widthOfCanvas);
    this.initLoadImage();
  }
  selectedImage(event) {
    this.showImageGalary = false;
    let ob = { sorce: event.sorce, lock: this.selectedDetails?.lock, displayName: this.selectedDetails?.displayName }
    this.addImageOnCanvas(ob, this.selectedDetails?.index)
  }
  showImageGalaryIteam() {
    this.showImageGalary = true;
  }
  async initLoadImage() {
    this.widthOfCanvas = document.getElementById('canvasContainer').offsetWidth;
    this.canvasHeight = document.getElementById('canvasContainer').offsetHeight;
    this.initcanvasHeight = this.canvasHeight;
    this.initwidthOfCanvas = this.widthOfCanvas
    if (this.dimention?.height == 1920 && this.dimention?.width == 1080) {
      this.imageListOfLoadingTemplate2.sort((a, b) => a.name - b.name)
      this.widthOfCanvas = document.getElementById('canvasContainer').offsetWidth;
      this.canvasHeight = document.getElementById('canvasContainer').offsetHeight;
      await this.addImageOnCanvasLoadingTime(this.imageListOfLoadingTemplate2, 0)
    }
    else {
      this.imageListOfLoadingTemplate.sort((a, b) => a.name - b.name)
      this.widthOfCanvas = document.getElementById('canvasContainer').offsetWidth;
      this.canvasHeight = document.getElementById('canvasContainer').offsetHeight;
      await this.addImageOnCanvasLoadingTime(this.imageListOfLoadingTemplate, 0)
    }

  }
  async addImageOnCanvas(element, _index) {

    if (element) {
      if (_index == 0) {
        // this.widthOfCanvas =this.initwidthOfCanvas
        // this.canvasHeight =this.initcanvasHeight
      }

      fabric.Image.fromURL(element.sorce, (image) => {
        image.set({
          left: 0,
          top: 0,

          hasRotatingPoint: false,
          lockUniScaling: true,
          lockRotation: true,
          angle: 0,
          hasBorders: true,
          opacity: 1,
          selectable: false,
          crossOrigin: "anonymous",
        });
        console.log(image.width, image.getBoundingRect().width)
        image.crossOrigin = 'anonymous';
        let ratioWidth = image.width / this.widthOfCanvas;
        let ratioHeight = image.height / this.canvasHeight;
        if (this.canvasHeight > this.widthOfCanvas) {
          image.scaleToHeight(this.canvasHeight);
        }
        else if (this.canvasHeight <= this.widthOfCanvas) {
          image.scaleToWidth(this.widthOfCanvas);
        }
        else {

        }
        this.fabricLayerCanvasObject.insertAt(image, _index, true);
        console.log(image.width, image.getBoundingRect().width)

        this.fabricLayerCanvasObject.centerObject(image);
        this.ObjectInstanceArray[_index] = { imageimstants: image, lock: element.lock, displayName: element?.displayName, type: 'image' };

        if (_index == 0) {
          console.log(image.getBoundingRect().width)
          this.fabricLayerCanvasObject.setWidth(image.getBoundingRect().width)
          this.fabricLayerCanvasObject.setHeight(image.getBoundingRect().height)
          document.getElementById('canvasContainer').style.width = image.getBoundingRect().width + 'px';
          document.getElementById('canvasContainer').style.height = image.getBoundingRect().height + 'px';
          this.fabricLayerCanvasObject.centerObject(image);
          console.log(this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y)
          let top1 = this.fabricLayerCanvasObject.getObjects()[0].top + ((this.fabricLayerCanvasObject.getObjects()[0].aCoords.bl.y) / 9)
          let top2 = this.fabricLayerCanvasObject.getObjects()[0].top + ((this.fabricLayerCanvasObject.getObjects()[0].aCoords.bl.y)) - 100
          let left1 = this.fabricLayerCanvasObject.getObjects()[0].left + ((this.fabricLayerCanvasObject.getObjects()[0].aCoords.br.x) / 2) - 50
          let left2 = this.fabricLayerCanvasObject.getObjects()[0].left + 20
          this.addTextOnCanvas(left1, top1, this.font_type[0][0].name, this.colorText1, "Input your text...", 2, 20, "Text1");
          this.addTextOnCanvas(left2, top2, this.font_type[0][0].name, this.colorText2, "Input your text... \n Company Name \n ContactNumber \n Address or other Information", 3, 15, "Text2");
          this.fabricLayerCanvasObject.getObjects()[5].scaleToWidth(this.ObjectInstanceArray[0].imageimstants.getBoundingRect().width / 3);
          this.fabricLayerCanvasObject.getObjects()[5].set({ top: this.ObjectInstanceArray[0].imageimstants.getBoundingRect().height / 2 + this.ObjectInstanceArray[0].imageimstants.getBoundingRect().height / 3.3, left: (this.ObjectInstanceArray[0].imageimstants.getBoundingRect().width) - this.fabricLayerCanvasObject.getObjects()[5].getBoundingRect().width })
          this.fabricLayerCanvasObject.getObjects()[1].scaleToWidth(this.ObjectInstanceArray[0].imageimstants.getBoundingRect().width, false)
          console.log(this.fabricLayerCanvasObject.getObjects()[1].height, this.fabricLayerCanvasObject.getObjects()[0].height)
          let t = (this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect().height / this.fabricLayerCanvasObject.getObjects()[1].height)
          console.log(t)
          console.log(this.fabricLayerCanvasObject.getObjects()[1].getBoundingRect(), this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect(), this.fabricLayerCanvasObject.getObjects()[0].height, this.fabricLayerCanvasObject.getObjects()[1].height)
          this.fabricLayerCanvasObject.getObjects()[1].set({ top: this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect().top, left: (this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect().left), scaleY: (t) })
          this.fabricLayerCanvasObject.renderAll()
          console.log(this.fabricLayerCanvasObject.getObjects()[1].getBoundingRect(), this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect())
          this.fabricLayerCanvasObject.renderAll()
        }
        if (_index == 1) {
          this.fabricLayerCanvasObject.getObjects()[1].scaleToWidth(this.ObjectInstanceArray[0].imageimstants.getBoundingRect().width, false)
          console.log(this.fabricLayerCanvasObject.getObjects()[1].height, this.fabricLayerCanvasObject.getObjects()[0].height)
          let t = (this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect().height / this.fabricLayerCanvasObject.getObjects()[1].height)
          console.log(t)
          console.log(this.fabricLayerCanvasObject.getObjects()[1].getBoundingRect(), this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect(), this.fabricLayerCanvasObject.getObjects()[0].height, this.fabricLayerCanvasObject.getObjects()[1].height)
          this.fabricLayerCanvasObject.getObjects()[1].set({ top: this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect().top, left: (this.fabricLayerCanvasObject.getObjects()[0].getBoundingRect().left), scaleY: (t) })
          this.fabricLayerCanvasObject.renderAll()
        }
        this.fabricLayerCanvasObject.renderAll()
        this.fabricLayerCanvasObject.setZoom(this.fabricLayerCanvasObject.getZoom() / 1);
      });

    }
  }
  async addImageOnCanvasLoadingTime(elementArray, index) {
    let element: any = elementArray[index]
    let _index = elementArray[index].name
    if (element) {


      await fabric.Image.fromURL(element.sorce, (image) => {
        image.crossOrigin = "anonymous";
        image.set({
          left: 0,
          top: 0,
          hasRotatingPoint: false,
          lockUniScaling: false,
          lockRotation: true,
          angle: 0,
          hasBorders: true,
          opacity: 1,
          selectable: false,
          crossOrigin: 'anonymous'
        });
        console.log(image.width)
        this.widthOfCanvas = document.getElementById('canvasContainer').offsetWidth;
        this.canvasHeight = document.getElementById('canvasContainer').offsetHeight;
        if (_index != 5) {
          if (this.widthOfCanvas > 550) {
            image.scaleToHeight(550);

          }
          else {
            console.log(image)
            if (image.getBoundingRect().height == image.getBoundingRect().width || (image.getBoundingRect().width < image.getBoundingRect().height)) {
              image.scaleToWidth(this.widthOfCanvas);
            }
            else if (image.getBoundingRect().height > image.getBoundingRect().width) {
              image.scaleToHeight(550);
            }

          }
          image.center();

        } else {

          console.log(this.canvasHeight)
          image.scaleToWidth(this.ObjectInstanceArray[0].imageimstants.getBoundingRect().width / 3);
          image.set({ top: this.ObjectInstanceArray[0].imageimstants.getBoundingRect().height / 2 + this.ObjectInstanceArray[0].imageimstants.getBoundingRect().height / 3.3, left: (this.ObjectInstanceArray[0].imageimstants.getBoundingRect().width) - image.getBoundingRect().width })
        }

        if (_index == 0) {
          console.log(image.getBoundingRect().width)
          this.fabricLayerCanvasObject.setWidth(image.getBoundingRect().width)
          this.fabricLayerCanvasObject.setHeight(image.getBoundingRect().height)
          document.getElementById('canvasContainer').style.width = image.getBoundingRect().width + 'px';
          document.getElementById('canvasContainer').style.height = image.getBoundingRect().height + 'px';

        }

        this.fabricLayerCanvasObject.renderAll()
        this.fabricLayerCanvasObject.insertAt(image, _index, true);
        if (_index != 5) {
          this.fabricLayerCanvasObject.centerObject(image);
        }
        this.ObjectInstanceArray[_index] = { imageimstants: image, lock: element.lock, displayName: element?.displayName, type: 'image' };
        if (_index == 0) {
          if (this.dimention.height == 1920) {
            console.log(this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y)
            let top1 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 9)
            let top2 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 2) + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 3) + 10
            let left1 = this.ObjectInstanceArray[0].imageimstants.left + ((this.ObjectInstanceArray[0].imageimstants.aCoords.br.x) / 5)
            let left2 = this.ObjectInstanceArray[0].imageimstants.left + 20
            let top3 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 3)
            let left3 = this.ObjectInstanceArray[0].imageimstants.left +((this.fabricLayerCanvasObject.getObjects()[0].aCoords.br.x) / 2)-100
            this.addTextOnCanvas(left1, top1, this.font_type[0][0].name, this.colorText1, "Input your text...", 2, 20, "Text1");
            this.addTextOnCanvas(left2, top2, this.font_type[0][0].name, this.colorText2, "Input your text... \n Company Name \n ContactNumber \n Address or other Information", 3, 15, "Text2");
            this.addConvertTextOnCanvas(left3, top3, this.font_type[0][0].name, this.colorText3, "We run so life can leap forward", 4, 15, "Higher Purpose Text");
            // console.log( this.imageListOfLoadingTemplate)
          }
          else {
            console.log(this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y)
            let top1 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 6)
            let top2 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 2) + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 5)
            let left1 = this.ObjectInstanceArray[0].imageimstants.left + ((this.ObjectInstanceArray[0].imageimstants.aCoords.br.x) / 3)
            let left2 = this.ObjectInstanceArray[0].imageimstants.left + 20
            let top3 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 3)
            let left3 = this.ObjectInstanceArray[0].imageimstants.left +((this.fabricLayerCanvasObject.getObjects()[0].aCoords.br.x) / 2)-100
            this.addTextOnCanvas(left1, top1, this.font_type[0][0].name, this.colorText1, "Input your text...", 2, 20, "Text1");
            this.addTextOnCanvas(left2, top2, this.font_type[0][0].name, this.colorText2, "Input your text... \n Company Name \n ContactNumber \n Address or other Information", 3, 15, "Text2");
            this.addConvertTextOnCanvas(left3, top3, this.font_type[0][0].name, this.colorText3, "We run so life can leap forward", 4, 15, "Higher Purpose Text");
          }

        }
        if (index + 1 < elementArray.length) {
          this.addImageOnCanvasLoadingTime(elementArray, index + 1)
        }
      }, { crossOrigin: 'anonymous' });

    }
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }
  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }
  chageImage(iteam, index) {
    fabric.Image.fromURL('../../../../assets/Template demo/template/4.jpg', (image) => {
      image.set({
        left: 0,
        top: 0,
        hasRotatingPoint: false,
        lockUniScaling: true,
        lockRotation: true,
        angle: 0,
        hasBorders: true,
        opacity: 1,
        selectable: true,
      });
      image.scaleToWidth(this.widthOfCanvas);
      image.scaleToHeight(400);
      this.extend(image, this.randomId());
      this.fabricLayerCanvasObject.insertAt(image, index, true);
      this.ObjectInstanceArray[index] = image;
    }, { crossOrigin: 'anonymous' });
  }
  zoomInCanvas() {
    this.fabricLayerCanvasObject.setZoom(this.fabricLayerCanvasObject.getZoom() * 1.1);
  }
  zoomOutCanVas() {
    this.fabricLayerCanvasObject.setZoom(this.fabricLayerCanvasObject.getZoom() / 1.1);
  }
  moveToRigthCanvas() {
    this.rightleftPoint = this.rightleftPoint + 10;
    var units = 10;
    var delta = new fabric.Point(units, 0);
    this.fabricLayerCanvasObject.relativePan(delta);
  }
  moveToLeftCanvas() {

    var units = 10;
    var delta = new fabric.Point(-units, 0);
    this.rightleftPoint = this.rightleftPoint - units;
    this.fabricLayerCanvasObject.relativePan(delta);
  }
  moveToUpCanvas() {

    var units = 10;
    var delta = new fabric.Point(0, -units);
    this.updownPoint = this.updownPoint - units
    this.fabricLayerCanvasObject.relativePan(delta);
  }
  moveToDownCanvas() {

    var units = 10;
    var delta = new fabric.Point(0, units);
    this.updownPoint = this.updownPoint + units
    this.fabricLayerCanvasObject.relativePan(delta);
  }
  selectImage(_index) {
    if (this.ObjectInstanceArray[_index].type == "text") {
      this.fabricLayerCanvasObject.setActiveObject(this.ObjectInstanceArray[_index].imageimstants);
      this.fabricLayerCanvasObject.renderAll();
      return
    }
    this.ObjectInstanceArray.forEach((element, index) => {
      if (index == _index) {
        element.imageimstants.opacity = 1;
      }
      else {
        element.imageimstants.opacity = 0;
      }
    });
    this.fabricLayerCanvasObject.renderAll();
  }
  selectAll() {
    this.ObjectInstanceArray.forEach((element, index) => {
      element.imageimstants.opacity = 1;
    });
    this.fabricLayerCanvasObject.renderAll();
  }
  chooseImage(_index) {
    this.showImageGalary = true;
    this.selectedDetails = { index: _index, displayName: this.ObjectInstanceArray[_index].displayName, lock: this.ObjectInstanceArray[_index].lock };
  }
  async saveImage() {
    this.loading = true;
    // console.log(this.ObjectInstanceArray[4])
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'abc.net/files/test.ino';
    link.download = "photo.png";
    document.body.appendChild(link);
    this.fabricLayerCanvasObject.setZoom(1);
    this.fabricLayerCanvasObject.renderAll();
    var delta = new fabric.Point(-this.rightleftPoint, 0);
    this.rightleftPoint = 0
    this.fabricLayerCanvasObject.relativePan(delta);
    this.fabricLayerCanvasObject.renderAll();
    var delta = new fabric.Point(0, -this.updownPoint);
    this.updownPoint = 0;
    this.fabricLayerCanvasObject.relativePan(delta);
    this.fabricLayerCanvasObject.renderAll();
    let tempfabricCanvas = this.fabricLayerCanvasObject;

    // if (this.disableText) {
    //   let language = this.LanguageOptions.find(x => x.id == this.selected_Language[0].id);
    //   const text = new fabric.Text(language.value, {
    //     left: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().left,
    //     top: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().top,
    //     fontFamily: this.font_type[4][0].name,
    //     angle: 0,
    //     fill: this.colorText3,
    //     scaleX: 1,
    //     scaleY: 1,
    //     hasControls: false,
    //     lockMovementX: false,
    //     lockMovementY: false,
    //     borderColor: 'yellow',
    //     selectable: true,
    //     borderDashArray: [7, 6],
    //     fontSize: this.fontSize[4],
    //     visible: true
    //   });

    //   tempfabricCanvas.insertAt(text, 4, true);
    // }



    let href = tempfabricCanvas.toDataURL({
      quality: 1,
      multiplier: 2,
      enableRetinaScaling: true,

    });
    // if (this.disableText && !this.showConvertText) {
    //   let language = this.LanguageOptions.find(x => x.id == 1);
    //   const text = new fabric.Text(language.value, {
    //     left: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().left,
    //     top: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().top,
    //     fontFamily: this.font_type[4][0].name,
    //     angle: 0,
    //     fill: this.colorText3,
    //     scaleX: 1,
    //     scaleY: 1,
    //     hasControls: false,
    //     lockMovementX: false,
    //     lockMovementY: false,
    //     borderColor: 'yellow',
    //     selectable: true,
    //     borderDashArray: [7, 6],
    //     fontSize: this.fontSize[4],
    //     visible: true
    //   });

    //   tempfabricCanvas.insertAt(text, 4, true);
    // }
    // console.log(href)
    link.href = href  // Save all combined images to one image
    let data = { fullName: 'photo.png', imageBase64: href, extension: 'png' };
    await this.service.onDownload(data);
    link.click();
    link.remove();
    this.loading = false;

  }
  close() {
    this.closed.emit();
  }
  addTextOnCanvas(_left: number, _top: number, _fontFamily: string, _colorText: string, _textContent: string, _position: number, _fontSize: number, _displayName: string) {
    const text = new fabric.IText(_textContent, {
      left: _left,
      top: _top,
      fontFamily: _fontFamily,
      angle: 0,
      fill: _colorText,
      scaleX: 1,
      scaleY: 1,
      hasControls: false,
      lockMovementX: false,
      lockMovementY: false,
      borderColor: 'yellow',
      selectable: true,
      borderDashArray: [7, 6],
      fontSize: _fontSize

    });
    this.fontSize[_position] = _fontSize;
    this.fabricLayerCanvasObject.insertAt(text, _position, true);
    this.ObjectInstanceArray[_position] = { imageimstants: text, lock: false, displayName: _displayName, type: 'text' };
  }
  addConvertTextOnCanvas(_left: number, _top: number, _fontFamily: string, _colorText: string, _textContent: string, _position: number, _fontSize: number, _displayName: string, _visible: boolean = false) {
    const text = new fabric.Text(_textContent, {
      left: _left,
      top: _top,
      fontFamily: _fontFamily,
      angle: 0,
      fill: _colorText,
      scaleX: 1,
      scaleY: 1,
      hasControls: false,
      lockMovementX: false,
      lockMovementY: false,
      borderColor: 'yellow',
      selectable: true,
      borderDashArray: [7, 6],
      fontSize: _fontSize,
      visible: _visible
    });
    this.fontSize[_position] = _fontSize;
    this.fabricLayerCanvasObject.insertAt(text, _position, true);
    this.ObjectInstanceArray[_position] = { imageimstants: text, lock: false, displayName: _displayName, type: 'text-convert' };
  }
  handleColorChange(_event, _color, _index) {
    console.log(_event, _color, _index)
    if (_index == 2) {
      this.colorText1 = _color;
      this.ObjectInstanceArray[_index].imageimstants.set({

        fill: _color
      });

      console.log(this.ObjectInstanceArray[_index].imageimstants.fill)
      this.fabricLayerCanvasObject.renderAll()
    }
    else if (_index == 3) {
      this.colorText2 = _color;
      this.ObjectInstanceArray[_index].imageimstants.set({

        fill: _color
      });
      this.fabricLayerCanvasObject.renderAll()
    }
    else if (_index == 4) {
      this.colorText3 = _color;
      this.fabricLayerCanvasObject.getObjects()[4].set({

        fill: _color
      });
      this.fabricLayerCanvasObject.renderAll()

    }
  }
  fontChange(event, _index) {
    if (event?.legth)
      console.log(event, _index)
    if (_index == 2) {
      this.ObjectInstanceArray[_index].imageimstants.set({

        fontFamily: event[0]?.name
      });
    }
    else if (_index == 3 || _index == 4) {
      let object: any = this.fabricLayerCanvasObject.getObjects()[_index]
      object.set({

        fontFamily: event[0]?.name
      });
    }
    this.fabricLayerCanvasObject.renderAll()
  }
  setFontSize(_Value, _index) {
if(_Value>100|| _Value<1)
return
    if (_index == 2) {

      this.ObjectInstanceArray[_index].imageimstants.set({

        fontSize: _Value
      })
    }
    else if (_index == 3 || _index == 4) {
      let object: any = this.fabricLayerCanvasObject.getObjects()[_index]
      object.set({

        fontSize: _Value
      })
    }
    this.fabricLayerCanvasObject.renderAll()
  }
  resetText(i: number) {

    if (this.dimention.height == 1920) {
      console.log(this.ObjectInstanceArray[2].imageimstants.aCoords.bl.y)
      let top1 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 9)
      let top2 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 2) + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 3) + 10
      let left1 = this.ObjectInstanceArray[0].imageimstants.left + ((this.ObjectInstanceArray[0].imageimstants.aCoords.br.x) / 5)
      let left2 = this.ObjectInstanceArray[0].imageimstants.left + 20
      if (i == 2) {
        this.addTextOnCanvas(left1, top1, this.font_type[0][0].name, this.colorText1, "Input your text...", 2, 20, "Text1");

      }
      if (i == 3) {
        this.addTextOnCanvas(left2, top2, this.font_type[0][0].name, this.colorText2, "Input your text... \n Company Name \n ContactNumber \n Address or other Information", 2, 15, "Text2");
      }
      console.log(this.imageListOfLoadingTemplate)
    }
    else {
      console.log(this.ObjectInstanceArray[2].imageimstants.aCoords.bl.y)
      let top1 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 6)
      let top2 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 2) + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 5)
      let left1 = this.ObjectInstanceArray[0].imageimstants.left + ((this.ObjectInstanceArray[0].imageimstants.aCoords.br.x) / 3)
      let left2 = this.ObjectInstanceArray[0].imageimstants.left + 20
      if (i == 2) {
        this.addTextOnCanvas(left1, top1, this.font_type[0][0].name, this.colorText1, "Input your text...", 2, 20, "Text1");

      }
      if (i == 3) {
        this.addTextOnCanvas(left2, top2, this.font_type[0][0].name, this.colorText2, "Input your text... \n Company Name \n ContactNumber \n Address or other Information", 3, 15, "Text2");
      }
    }


  }
  backGalary() {
    this.showImageGalary = false;
  }
  activationChange(event: any) {
    console.log(event)
    this.disableText = event
    let top3 = this.ObjectInstanceArray[0].imageimstants.top + ((this.ObjectInstanceArray[0].imageimstants.aCoords.bl.y) / 3)
    let left3 = this.ObjectInstanceArray[0].imageimstants.left +((this.fabricLayerCanvasObject.getObjects()[0].aCoords.br.x) / 2)-100
    this.addConvertTextOnCanvas(left3, top3, this.font_type[0][0].name, this.colorText3, "We run so life can leap forward", 4, 15, "Higher Purpose Text", event);
    this.fabricLayerCanvasObject.renderAll()
  }
  LanguageChange(event, _index) {
    console.log(event)
    if(this.disableText)
    {
    let language = this.LanguageOptions.find(x => x.id == this.selected_Language[0].id);
    const text = new fabric.Text(language.value, {
      left: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().left,
      top: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().top,
      fontFamily: this.font_type[4][0].name,
      angle: 0,
      fill: this.colorText3,
      scaleX: 1,
      scaleY: 1,
      hasControls: false,
      lockMovementX: false,
      lockMovementY: false,
      borderColor: 'yellow',
      selectable: true,
      borderDashArray: [7, 6],
      fontSize: this.fontSize[4],
      visible: true
    });

    this.fabricLayerCanvasObject.insertAt(text, 4, true);
    this.fabricLayerCanvasObject.renderAll()
    }
  }
  showConvertTextChange(event) {
    if (!this.disableText) {
      return
    }

    if (event) {
      this.showConvertText = event
      let language = this.LanguageOptions.find(x => x.id == this.selected_Language[0].id);
      const text = new fabric.Text(language.value, {
        left: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().left,
        top: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().top,
        fontFamily: this.font_type[4][0].name,
        angle: 0,
        fill: this.colorText3,
        scaleX: 1,
        scaleY: 1,
        hasControls: false,
        lockMovementX: false,
        lockMovementY: false,
        borderColor: 'yellow',
        selectable: true,
        borderDashArray: [7, 6],
        fontSize: this.fontSize[4],
        visible: true
      });

      this.fabricLayerCanvasObject.insertAt(text, 4, true);
      this.fabricLayerCanvasObject.renderAll()
    }
    else {
      this.showConvertText = event
      let language = this.LanguageOptions.find(x => x.id == 1);
      const text = new fabric.Text(language.value, {
        left: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().left,
        top: this.fabricLayerCanvasObject.getObjects()[4].getBoundingRect().top,
        fontFamily: this.font_type[4][0].name,
        angle: 0,
        fill: this.colorText3,
        scaleX: 1,
        scaleY: 1,
        hasControls: false,
        lockMovementX: false,
        lockMovementY: false,
        borderColor: 'yellow',
        selectable: true,
        borderDashArray: [7, 6],
        fontSize: this.fontSize[4],
        visible: true
      });

      this.fabricLayerCanvasObject.insertAt(text, 4, true);
      this.fabricLayerCanvasObject.renderAll()
    }

  }
}

