import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapuserpropertyComponent } from './mapuserproperty.component';

describe('MapuserpropertyComponent', () => {
  let component: MapuserpropertyComponent;
  let fixture: ComponentFixture<MapuserpropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapuserpropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapuserpropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
