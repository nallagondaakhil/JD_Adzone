import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangugaePreferenceComponent } from './langugae-preference.component';

describe('LangugaePreferenceComponent', () => {
  let component: LangugaePreferenceComponent;
  let fixture: ComponentFixture<LangugaePreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangugaePreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangugaePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
