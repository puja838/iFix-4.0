import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProcessTemplateComponent } from './map-process-template.component';

describe('MapProcessTemplateComponent', () => {
  let component: MapProcessTemplateComponent;
  let fixture: ComponentFixture<MapProcessTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProcessTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProcessTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
