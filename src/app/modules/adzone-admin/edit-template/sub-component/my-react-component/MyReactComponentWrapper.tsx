import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MyReactComponent } from './MyReactComponent';

const containerElementName = 'myReactComponentContainer';

@Component({
  selector: 'app-my-component',
  template: `<span #${containerElementName}></span>`,
  styleUrls: ['./MyReactComponent.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyComponentWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  @Input() public sorce:{name:string,sorce:string} ;
  @Output() public componentClick = new EventEmitter<void>();
  @Output() public save = new EventEmitter();

  constructor() {
    this.handleDivClicked = this.handleDivClicked.bind(this);
    this.savedCallBackEvent = this.savedCallBackEvent.bind(this);
  }

  public handleDivClicked() {
    if (this.componentClick) {
      this.componentClick.emit();

     // this.render();
    }
  }
  public savedCallBackEvent(param:any)
  {
console.log(param)
    this.save.emit(param);

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {

    const {sorce} = this;

    ReactDOM.render(<div className={'i-am-classy'}>

      <MyReactComponent sorce={sorce} savedCallBack={this.savedCallBackEvent} onClick={this.handleDivClicked}/>
    </div>, this.containerRef.nativeElement);

  }

}
