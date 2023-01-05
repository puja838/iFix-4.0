import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelTemplateConfigComponent } from './excel-template-config.component';

describe('ExcelTemplateConfigComponent', () => {
  let component: ExcelTemplateConfigComponent;
  let fixture: ComponentFixture<ExcelTemplateConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelTemplateConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
