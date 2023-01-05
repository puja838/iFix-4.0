import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPropertyComponent } from './ticket-property.component';

describe('TicketPropertyComponent', () => {
  let component: TicketPropertyComponent;
  let fixture: ComponentFixture<TicketPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
