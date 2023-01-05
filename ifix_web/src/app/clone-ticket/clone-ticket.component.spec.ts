import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneTicketComponent } from './clone-ticket.component';

describe('CloneTicketComponent', () => {
  let component: CloneTicketComponent;
  let fixture: ComponentFixture<CloneTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
