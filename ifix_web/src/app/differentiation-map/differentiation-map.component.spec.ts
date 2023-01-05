import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferentiationMapComponent } from './differentiation-map.component';

describe('DifferentiationMapComponent', () => {
  let component: DifferentiationMapComponent;
  let fixture: ComponentFixture<DifferentiationMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifferentiationMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifferentiationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
