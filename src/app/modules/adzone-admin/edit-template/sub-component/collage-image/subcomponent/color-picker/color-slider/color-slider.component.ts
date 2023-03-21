import { Component, ViewChild, ElementRef, AfterViewInit, Output, HostListener, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.css']
})
export class ColorSliderComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  @Output()
  color: EventEmitter<string> = new EventEmitter();

  private ctx: CanvasRenderingContext2D;
  private mousedown: boolean = false;
  private selectedHeight: number;

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgb(54, 124, 43)');
    gradient.addColorStop(0.10, 'rgb(255, 222, 0)');
    gradient.addColorStop(0.20, 'rgb(84, 88, 90)');
    gradient.addColorStop(0.30, 'rgb(242, 169, 0)');
    gradient.addColorStop(0.40, 'rgb(0, 0, 0)');
    gradient.addColorStop(0.50, 'rgb(51, 51, 51)');
    gradient.addColorStop(0.60, 'rgb(102, 102, 102)');
    gradient.addColorStop(0.70, 'rgb(102, 102, 102)');
    gradient.addColorStop(0.80, 'rgb(153, 153, 153)');
    gradient.addColorStop(0.90, 'rgb(229, 229, 229)');
    gradient.addColorStop(1, 'rgb(255, 255, 255)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

    if (this.selectedHeight) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 5;
      this.ctx.rect(0, this.selectedHeight - 5, width, 10);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  }
}
