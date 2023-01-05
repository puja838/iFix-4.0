import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaValidationComponent } from './mfa-validation.component';

describe('MfaValidationComponent', () => {
  let component: MfaValidationComponent;
  let fixture: ComponentFixture<MfaValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfaValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
