import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LDAPConfigComponent } from './ldap-config.component';

describe('LDAPConfigComponent', () => {
  let component: LDAPConfigComponent;
  let fixture: ComponentFixture<LDAPConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LDAPConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LDAPConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
