import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentUploadedReportComponent } from './document-uploaded-report.component';

describe('DocumentUploadedReportComponent', () => {
  let component: DocumentUploadedReportComponent;
  let fixture: ComponentFixture<DocumentUploadedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentUploadedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentUploadedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
