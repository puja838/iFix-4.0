import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LDAPGroupUserComponent } from './ldap-group-user.component';

describe('LDAPGroupUserComponent', () => {
  let component: LDAPGroupUserComponent;
  let fixture: ComponentFixture<LDAPGroupUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LDAPGroupUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LDAPGroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
