import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityLocationMappingComponent } from './priority-location-mapping.component';

describe('PriorityLocationMappingComponent', () => {
  let component: PriorityLocationMappingComponent;
  let fixture: ComponentFixture<PriorityLocationMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityLocationMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityLocationMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
