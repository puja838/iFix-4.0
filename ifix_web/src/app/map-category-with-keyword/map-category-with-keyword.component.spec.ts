import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCategoryWithKeywordComponent } from './map-category-with-keyword.component';

describe('MapCategoryWithKeywordComponent', () => {
  let component: MapCategoryWithKeywordComponent;
  let fixture: ComponentFixture<MapCategoryWithKeywordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCategoryWithKeywordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCategoryWithKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
