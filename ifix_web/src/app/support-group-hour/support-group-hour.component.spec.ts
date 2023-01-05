import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupHourComponent } from './support-group-hour.component';

describe('SupportGroupHourComponent', () => {
  let component: SupportGroupHourComponent;
  let fixture: ComponentFixture<SupportGroupHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportGroupHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGroupHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
