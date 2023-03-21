import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerReportComponent } from './dealer-report.component';

describe('DealerReportComponent', () => {
  let component: DealerReportComponent;
  let fixture: ComponentFixture<DealerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
