import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDownloadedReportComponent } from './document-downloaded-report.component';

describe('DocumentDownloadedReportComponent', () => {
  let component: DocumentDownloadedReportComponent;
  let fixture: ComponentFixture<DocumentDownloadedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentDownloadedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDownloadedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
