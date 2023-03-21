import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementCopyComponent } from './user-management.component';

describe('UserManagementComponent', () => {
  let component: VendorManagementCopyComponent;
  let fixture: ComponentFixture<VendorManagementCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorManagementCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
