import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRoleManagementComponent } from './add-edit-role-management.component';

describe('AddEditRoleManagementComponent', () => {
  let component: AddEditRoleManagementComponent;
  let fixture: ComponentFixture<AddEditRoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRoleManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
