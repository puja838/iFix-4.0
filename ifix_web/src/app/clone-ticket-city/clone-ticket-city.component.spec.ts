import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneTicketCityComponent } from './clone-ticket-city.component';

describe('CloneTicketCityComponent', () => {
  let component: CloneTicketCityComponent;
  let fixture: ComponentFixture<CloneTicketCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneTicketCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneTicketCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
