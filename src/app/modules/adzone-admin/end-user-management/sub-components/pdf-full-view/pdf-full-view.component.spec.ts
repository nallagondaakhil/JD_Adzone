import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFullViewComponent } from './pdf-full-view.component';

describe('PdfFullViewComponent', () => {
  let component: PdfFullViewComponent;
  let fixture: ComponentFixture<PdfFullViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfFullViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
