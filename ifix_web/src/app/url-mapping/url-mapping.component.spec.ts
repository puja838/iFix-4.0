import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlMappingComponent } from './url-mapping.component';

describe('UrlMappingComponent', () => {
  let component: UrlMappingComponent;
  let fixture: ComponentFixture<UrlMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
