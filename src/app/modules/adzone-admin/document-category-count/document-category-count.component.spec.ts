import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCategoryCountComponent } from './document-category-count.component';

describe('DocumentCategoryCountComponent', () => {
  let component: DocumentCategoryCountComponent;
  let fixture: ComponentFixture<DocumentCategoryCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCategoryCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCategoryCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
