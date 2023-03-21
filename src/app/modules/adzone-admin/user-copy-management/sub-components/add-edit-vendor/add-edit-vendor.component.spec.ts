import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVendorCopyComponent } from './add-edit-vendor.component';

describe('AddEditVendorComponent', () => {
  let component: AddEditVendorCopyComponent;
  let fixture: ComponentFixture<AddEditVendorCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVendorCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVendorCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
