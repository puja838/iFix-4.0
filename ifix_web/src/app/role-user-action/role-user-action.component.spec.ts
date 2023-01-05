import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUserActionComponent } from './role-user-action.component';

describe('RoleUserActionComponent', () => {
  let component: RoleUserActionComponent;
  let fixture: ComponentFixture<RoleUserActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleUserActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleUserActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
