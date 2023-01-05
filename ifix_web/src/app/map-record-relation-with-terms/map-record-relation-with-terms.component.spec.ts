import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRecordRelationWithTermsComponent } from './map-record-relation-with-terms.component';

describe('MapRecordRelationWithTermsComponent', () => {
  let component: MapRecordRelationWithTermsComponent;
  let fixture: ComponentFixture<MapRecordRelationWithTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRecordRelationWithTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRecordRelationWithTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
