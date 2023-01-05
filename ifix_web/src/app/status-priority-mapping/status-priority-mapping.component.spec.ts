import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPriorityMappingComponent } from './status-priority-mapping.component';

describe('StatusPriorityMappingComponent', () => {
  let component: StatusPriorityMappingComponent;
  let fixture: ComponentFixture<StatusPriorityMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusPriorityMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusPriorityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
