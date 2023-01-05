import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaIndicatorComponent } from './sla-indicator.component';

describe('SlaIndicatorComponent', () => {
  let component: SlaIndicatorComponent;
  let fixture: ComponentFixture<SlaIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
