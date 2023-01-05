import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateTypeComponent } from './state-type.component';

describe('StateTypeComponent', () => {
  let component: StateTypeComponent;
  let fixture: ComponentFixture<StateTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
