import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTempleteComponent } from './sms-templete.component';

describe('SmsTempleteComponent', () => {
  let component: SmsTempleteComponent;
  let fixture: ComponentFixture<SmsTempleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsTempleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsTempleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
