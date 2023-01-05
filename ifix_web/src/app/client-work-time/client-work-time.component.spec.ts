import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWorkTimeComponent } from './client-work-time.component';

describe('ClientWorkTimeComponent', () => {
  let component: ClientWorkTimeComponent;
  let fixture: ComponentFixture<ClientWorkTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientWorkTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientWorkTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
