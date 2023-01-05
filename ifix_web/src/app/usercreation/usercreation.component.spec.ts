import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercreationComponent } from './usercreation.component';

describe('UsercreationComponent', () => {
  let component: UsercreationComponent;
  let fixture: ComponentFixture<UsercreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsercreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
