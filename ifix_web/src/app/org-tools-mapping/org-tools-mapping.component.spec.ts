import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgToolsMappingComponent } from './org-tools-mapping.component';

describe('OrgToolsMappingComponent', () => {
  let component: OrgToolsMappingComponent;
  let fixture: ComponentFixture<OrgToolsMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgToolsMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgToolsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
