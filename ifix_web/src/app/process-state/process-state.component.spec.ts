import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStateComponent } from './process-state.component';

describe('ProcessStateComponent', () => {
  let component: ProcessStateComponent;
  let fixture: ComponentFixture<ProcessStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
