import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMappingComponent } from './task-mapping.component';

describe('TaskMappingComponent', () => {
  let component: TaskMappingComponent;
  let fixture: ComponentFixture<TaskMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
