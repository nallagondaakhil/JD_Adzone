import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpersonateUserComponent } from './impersonate-user.component';

describe('ImpersonateUserComponent', () => {
  let component: ImpersonateUserComponent;
  let fixture: ComponentFixture<ImpersonateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpersonateUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpersonateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
