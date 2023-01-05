import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUserRoleComponent } from './module-user-role.component';

describe('ModuleUserRoleComponent', () => {
  let component: ModuleUserRoleComponent;
  let fixture: ComponentFixture<ModuleUserRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleUserRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
