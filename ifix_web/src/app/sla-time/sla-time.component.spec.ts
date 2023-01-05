import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaTimeComponent } from './sla-time.component';

describe('SlaTimeComponent', () => {
  let component: SlaTimeComponent;
  let fixture: ComponentFixture<SlaTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
