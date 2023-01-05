import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuQueryComponent } from './menu-query.component';

describe('MenuQueryComponent', () => {
  let component: MenuQueryComponent;
  let fixture: ComponentFixture<MenuQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
