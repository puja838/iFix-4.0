import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditonalFieldComponent } from './additonal-field.component';

describe('AdditonalFieldComponent', () => {
  let component: AdditonalFieldComponent;
  let fixture: ComponentFixture<AdditonalFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditonalFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditonalFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
