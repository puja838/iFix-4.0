import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSlaComponent } from './client-sla.component';

describe('ClientSlaComponent', () => {
  let component: ClientSlaComponent;
  let fixture: ComponentFixture<ClientSlaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
