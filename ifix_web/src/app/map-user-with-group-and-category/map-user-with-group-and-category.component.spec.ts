import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapUserWithGroupAndCategoryComponent } from './map-user-with-group-and-category.component';

describe('MapUserWithGroupAndCategoryComponent', () => {
  let component: MapUserWithGroupAndCategoryComponent;
  let fixture: ComponentFixture<MapUserWithGroupAndCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapUserWithGroupAndCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapUserWithGroupAndCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
