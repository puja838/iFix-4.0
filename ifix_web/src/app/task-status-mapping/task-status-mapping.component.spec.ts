import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatusMappingComponent } from './task-status-mapping.component';

describe('TaskStatusMappingComponent', () => {
  let component: TaskStatusMappingComponent;
  let fixture: ComponentFixture<TaskStatusMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskStatusMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatusMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
