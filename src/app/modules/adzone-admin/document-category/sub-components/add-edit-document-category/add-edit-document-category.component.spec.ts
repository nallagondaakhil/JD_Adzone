import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumentCategoryComponent } from './add-edit-document-category.component';

describe('AddEditDocumentCategoryComponent', () => {
  let component: AddEditDocumentCategoryComponent;
  let fixture: ComponentFixture<AddEditDocumentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDocumentCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDocumentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
