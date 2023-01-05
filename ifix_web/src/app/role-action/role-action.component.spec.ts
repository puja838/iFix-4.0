import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleActionComponent } from './role-action.component';

describe('RoleActionComponent', () => {
  let component: RoleActionComponent;
  let fixture: ComponentFixture<RoleActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
