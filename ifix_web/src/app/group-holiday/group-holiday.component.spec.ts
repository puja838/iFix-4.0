import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupHolidayComponent } from './group-holiday.component';

describe('GroupHolidayComponent', () => {
  let component: GroupHolidayComponent;
  let fixture: ComponentFixture<GroupHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
