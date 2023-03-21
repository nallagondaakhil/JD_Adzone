import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageCollagesComponent } from './edit-image-collages.component';

describe('EditImageCollagesComponent', () => {
  let component: EditImageCollagesComponent;
  let fixture: ComponentFixture<EditImageCollagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditImageCollagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageCollagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
