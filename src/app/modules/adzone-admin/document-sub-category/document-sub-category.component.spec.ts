import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSubCategoryComponent } from './document-sub-category.component';

describe('DocumentSubCategoryComponent', () => {
  let component: DocumentSubCategoryComponent;
  let fixture: ComponentFixture<DocumentSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
