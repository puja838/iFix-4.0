import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSystemidComponent } from './update-systemid.component';

describe('UpdateSystemidComponent', () => {
  let component: UpdateSystemidComponent;
  let fixture: ComponentFixture<UpdateSystemidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSystemidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSystemidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
