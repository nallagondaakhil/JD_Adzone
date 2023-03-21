import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jd-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() message: string;
  constructor() { }

  ngOnInit() {
  }

}
