import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTicketComponent } from './email-ticket.component';

describe('EmailTicketComponent', () => {
  let component: EmailTicketComponent;
  let fixture: ComponentFixture<EmailTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
