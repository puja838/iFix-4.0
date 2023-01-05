import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaCriteriaComponent } from './sla-criteria.component';

describe('SlaCriteriaComponent', () => {
  let component: SlaCriteriaComponent;
  let fixture: ComponentFixture<SlaCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
