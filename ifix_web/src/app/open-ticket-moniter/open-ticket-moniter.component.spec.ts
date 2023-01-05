import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTicketMoniterComponent } from './open-ticket-moniter.component';

describe('OpenTicketMoniterComponent', () => {
  let component: OpenTicketMoniterComponent;
  let fixture: ComponentFixture<OpenTicketMoniterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenTicketMoniterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenTicketMoniterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
