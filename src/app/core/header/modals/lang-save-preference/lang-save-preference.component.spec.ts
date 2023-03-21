import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangSavePreferenceComponent } from './lang-save-preference.component';

describe('LangSavePreferenceComponent', () => {
  let component: LangSavePreferenceComponent;
  let fixture: ComponentFixture<LangSavePreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangSavePreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangSavePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
