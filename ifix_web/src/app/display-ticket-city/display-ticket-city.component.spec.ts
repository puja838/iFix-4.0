import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTicketCityComponent } from './display-ticket-city.component';

describe('DisplayTicketCityComponent', () => {
  let component: DisplayTicketCityComponent;
  let fixture: ComponentFixture<DisplayTicketCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayTicketCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTicketCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
