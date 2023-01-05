import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAssetComponent } from './map-asset.component';

describe('MapAssetComponent', () => {
  let component: MapAssetComponent;
  let fixture: ComponentFixture<MapAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
