import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTemplateStateComponent } from './process-template-state.component';

describe('ProcessTemplateStateComponent', () => {
  let component: ProcessTemplateStateComponent;
  let fixture: ComponentFixture<ProcessTemplateStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessTemplateStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTemplateStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
