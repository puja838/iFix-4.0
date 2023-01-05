import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAttributesMappingComponent } from './external-attributes-mapping.component';

describe('ExternalAttributesMappingComponent', () => {
  let component: ExternalAttributesMappingComponent;
  let fixture: ComponentFixture<ExternalAttributesMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAttributesMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAttributesMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
