import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadUserCopyComponent } from './bulk-upload-vendor.component';

describe('BulkUploadVendorComponent', () => {
  let component: BulkUploadUserCopyComponent;
  let fixture: ComponentFixture<BulkUploadUserCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadUserCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadUserCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
