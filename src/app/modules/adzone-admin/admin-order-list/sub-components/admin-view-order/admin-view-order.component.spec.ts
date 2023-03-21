import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewOrderComponent } from './admin-view-order.component';

describe('AdminViewOrderComponent', () => {
  let component: AdminViewOrderComponent;
  let fixture: ComponentFixture<AdminViewOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
