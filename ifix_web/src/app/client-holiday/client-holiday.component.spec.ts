import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHolidayComponent } from './client-holiday.component';

describe('ClientHolidayComponent', () => {
  let component: ClientHolidayComponent;
  let fixture: ComponentFixture<ClientHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
