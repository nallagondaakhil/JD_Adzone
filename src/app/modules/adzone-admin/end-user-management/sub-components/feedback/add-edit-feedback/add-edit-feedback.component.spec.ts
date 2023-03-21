import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFeedbackComponent } from './add-edit-feedback.component';

describe('AddEditFeedbackComponent', () => {
  let component: AddEditFeedbackComponent;
  let fixture: ComponentFixture<AddEditFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
