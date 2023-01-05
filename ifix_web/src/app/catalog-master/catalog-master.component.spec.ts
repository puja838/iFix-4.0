import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMasterComponent } from './catalog-master.component';

describe('CatalogMasterComponent', () => {
  let component: CatalogMasterComponent;
  let fixture: ComponentFixture<CatalogMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
