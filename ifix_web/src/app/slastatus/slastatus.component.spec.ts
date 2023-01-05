import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlastatusComponent } from './slastatus.component';

describe('SlastatusComponent', () => {
  let component: SlastatusComponent;
  let fixture: ComponentFixture<SlastatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlastatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlastatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
