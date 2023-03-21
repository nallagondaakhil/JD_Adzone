import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumentTypeComponent } from './add-edit-document-type.component';

describe('AddEditDocumentTypeComponent', () => {
  let component: AddEditDocumentTypeComponent;
  let fixture: ComponentFixture<AddEditDocumentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDocumentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
