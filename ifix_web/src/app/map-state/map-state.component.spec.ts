import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStateComponent } from './map-state.component';

describe('MapStateComponent', () => {
  let component: MapStateComponent;
  let fixture: ComponentFixture<MapStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
