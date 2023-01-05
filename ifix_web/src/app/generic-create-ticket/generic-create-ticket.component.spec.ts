import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCreateTicketComponent } from './generic-create-ticket.component';

describe('GenericCreateTicketComponent', () => {
  let component: GenericCreateTicketComponent;
  let fixture: ComponentFixture<GenericCreateTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericCreateTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericCreateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
