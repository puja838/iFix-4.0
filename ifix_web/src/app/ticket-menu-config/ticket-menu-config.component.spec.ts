import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMenuConfigComponent } from './ticket-menu-config.component';

describe('TicketMenuConfigComponent', () => {
  let component: TicketMenuConfigComponent;
  let fixture: ComponentFixture<TicketMenuConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketMenuConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketMenuConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
