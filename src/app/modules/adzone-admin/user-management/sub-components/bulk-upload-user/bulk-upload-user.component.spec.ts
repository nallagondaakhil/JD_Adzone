import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadUserComponent } from './bulk-upload-user.component';

describe('BulkUploadUserComponent', () => {
  let component: BulkUploadUserComponent;
  let fixture: ComponentFixture<BulkUploadUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
