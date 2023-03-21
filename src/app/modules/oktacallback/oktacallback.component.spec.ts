import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OktacallbackComponent } from './oktacallback.component';

describe('OktacallbackComponent', () => {
  let component: OktacallbackComponent;
  let fixture: ComponentFixture<OktacallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OktacallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OktacallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
