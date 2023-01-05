import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTicketConfigComponent } from './email-ticket-config.component';

describe('EmailTicketConfigComponent', () => {
  let component: EmailTicketConfigComponent;
  let fixture: ComponentFixture<EmailTicketConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTicketConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTicketConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
