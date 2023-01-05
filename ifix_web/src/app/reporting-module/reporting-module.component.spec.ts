import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingModuleComponent } from './reporting-module.component';

describe('ReportingModuleComponent', () => {
  let component: ReportingModuleComponent;
  let fixture: ComponentFixture<ReportingModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
