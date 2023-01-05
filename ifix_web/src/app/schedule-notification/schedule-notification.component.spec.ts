import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleNotificationComponent } from './schedule-notification.component';

describe('ScheduleNotificationComponent', () => {
  let component: ScheduleNotificationComponent;
  let fixture: ComponentFixture<ScheduleNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
