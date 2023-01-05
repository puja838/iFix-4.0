import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupUserComponent } from './support-group-user.component';

describe('SupportGroupUserComponent', () => {
  let component: SupportGroupUserComponent;
  let fixture: ComponentFixture<SupportGroupUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportGroupUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
