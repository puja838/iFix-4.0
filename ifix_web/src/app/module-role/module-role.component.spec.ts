import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRoleComponent } from './module-role.component';

describe('ModuleRoleComponent', () => {
  let component: ModuleRoleComponent;
  let fixture: ComponentFixture<ModuleRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
