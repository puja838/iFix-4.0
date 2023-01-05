import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogSeqComponent } from './activity-log-seq.component';

describe('ActivityLogSeqComponent', () => {
  let component: ActivityLogSeqComponent;
  let fixture: ComponentFixture<ActivityLogSeqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLogSeqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogSeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
