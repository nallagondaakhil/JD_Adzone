import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessControlCopyComponent } from './user-access-control.component';

describe('UserAccessControlComponent', () => {
  let component: UserAccessControlCopyComponent;
  let fixture: ComponentFixture<UserAccessControlCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccessControlCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessControlCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
