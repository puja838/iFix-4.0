import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesConfigeComponent } from './services-confige.component';

describe('ServicesConfigeComponent', () => {
  let component: ServicesConfigeComponent;
  let fixture: ComponentFixture<ServicesConfigeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesConfigeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesConfigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
