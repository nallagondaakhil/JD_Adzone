import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePreferenceComponent } from './save-preference.component';

describe('SavePreferenceComponent', () => {
  let component: SavePreferenceComponent;
  let fixture: ComponentFixture<SavePreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavePreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
