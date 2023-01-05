import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultGroupComponent } from './default-group.component';

describe('DefaultGroupComponent', () => {
  let component: DefaultGroupComponent;
  let fixture: ComponentFixture<DefaultGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
