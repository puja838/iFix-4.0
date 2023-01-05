import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUrlComponent } from './menu-url.component';

describe('MenuUrlComponent', () => {
  let component: MenuUrlComponent;
  let fixture: ComponentFixture<MenuUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
