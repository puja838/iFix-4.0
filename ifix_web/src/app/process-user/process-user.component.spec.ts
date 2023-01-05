import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessUserComponent } from './process-user.component';

describe('ProcessUserComponent', () => {
  let component: ProcessUserComponent;
  let fixture: ComponentFixture<ProcessUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
