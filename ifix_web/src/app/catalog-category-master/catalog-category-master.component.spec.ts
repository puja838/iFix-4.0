import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCategoryMasterComponent } from './catalog-category-master.component';

describe('CatalogCategoryMasterComponent', () => {
  let component: CatalogCategoryMasterComponent;
  let fixture: ComponentFixture<CatalogCategoryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogCategoryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
