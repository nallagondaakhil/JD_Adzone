import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserManagementComponent } from './end-user-management.component';

describe('EndUserManagementComponent', () => {
  let component: EndUserManagementComponent;
  let fixture: ComponentFixture<EndUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndUserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
