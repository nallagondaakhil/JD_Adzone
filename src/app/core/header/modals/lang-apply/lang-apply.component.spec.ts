import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangApplyComponent } from './lang-apply.component';

describe('LangApplyComponent', () => {
  let component: LangApplyComponent;
  let fixture: ComponentFixture<LangApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
