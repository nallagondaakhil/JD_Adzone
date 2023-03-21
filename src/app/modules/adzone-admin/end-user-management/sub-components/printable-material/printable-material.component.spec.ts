import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableMaterialComponent } from './printable-material.component';

describe('PrintableMaterialComponent', () => {
  let component: PrintableMaterialComponent;
  let fixture: ComponentFixture<PrintableMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintableMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
