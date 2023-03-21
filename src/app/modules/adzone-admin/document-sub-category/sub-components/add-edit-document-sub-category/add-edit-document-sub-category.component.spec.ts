import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumentSubCategoryComponent } from './add-edit-document-sub-category.component';

describe('AddEditDocumentSubCategoryComponent', () => {
  let component: AddEditDocumentSubCategoryComponent;
  let fixture: ComponentFixture<AddEditDocumentSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDocumentSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDocumentSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
