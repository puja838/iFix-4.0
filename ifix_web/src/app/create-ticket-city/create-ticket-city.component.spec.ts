import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTicketCityComponent } from './create-ticket-city.component';

describe('CreateTicketCityComponent', () => {
  let component: CreateTicketCityComponent;
  let fixture: ComponentFixture<CreateTicketCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTicketCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTicketCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
