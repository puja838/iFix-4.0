import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyLevelComponent } from './property-level.component';

describe('PropertyLevelComponent', () => {
  let component: PropertyLevelComponent;
  let fixture: ComponentFixture<PropertyLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
