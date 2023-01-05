import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTemplateComponent } from './process-template.component';

describe('ProcessTemplateComponent', () => {
  let component: ProcessTemplateComponent;
  let fixture: ComponentFixture<ProcessTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
