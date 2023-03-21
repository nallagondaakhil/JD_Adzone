import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadVendorComponent } from './bulk-upload-vendor.component';

describe('BulkUploadVendorComponent', () => {
  let component: BulkUploadVendorComponent;
  let fixture: ComponentFixture<BulkUploadVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
