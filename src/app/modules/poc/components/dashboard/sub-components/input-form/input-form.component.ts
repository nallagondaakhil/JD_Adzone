import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegExUtils } from 'src/app/shared/utils/regex.utils';

@Component({
  selector: 'jd-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss'],
})
export class InputFormComponent implements OnInit {
  model: any = {};
  isEmailValid: boolean;

  @ViewChild('f', { static: true }) form: NgForm;
  constructor() {}

  ngOnInit(): void {}

  validateEmail() {
    this.isEmailValid = RegExUtils.isValidEmail(this.model.email);
  }

  // onSubmit() {
  //   if (this.form.valid) {
  //     console.log('form submitted');
  //   } else {
  //     this.validateEmail();
  //   }
  // }
}
