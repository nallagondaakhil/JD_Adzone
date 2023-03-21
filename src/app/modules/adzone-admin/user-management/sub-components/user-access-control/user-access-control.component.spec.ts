import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessControlComponent } from './user-access-control.component';

describe('UserAccessControlComponent', () => {
  let component: UserAccessControlComponent;
  let fixture: ComponentFixture<UserAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccessControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
