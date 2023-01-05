import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapcatagorywithtaskComponent } from './mapcatagorywithtask.component';

describe('MapcatagorywithtaskComponent', () => {
  let component: MapcatagorywithtaskComponent;
  let fixture: ComponentFixture<MapcatagorywithtaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapcatagorywithtaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapcatagorywithtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
