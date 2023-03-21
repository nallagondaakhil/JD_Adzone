import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageCollgeComponent } from './edit-image-collge.component';

describe('EditImageCollgeComponent', () => {
  let component: EditImageCollgeComponent;
  let fixture: ComponentFixture<EditImageCollgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditImageCollgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageCollgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
