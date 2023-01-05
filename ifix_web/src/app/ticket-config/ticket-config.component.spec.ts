import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketConfigComponent } from './ticket-config.component';

describe('TicketConfigComponent', () => {
  let component: TicketConfigComponent;
  let fixture: ComponentFixture<TicketConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
