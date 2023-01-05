import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTermMapComponent } from './group-term-map.component';

describe('GroupTermMapComponent', () => {
  let component: GroupTermMapComponent;
  let fixture: ComponentFixture<GroupTermMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTermMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTermMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
