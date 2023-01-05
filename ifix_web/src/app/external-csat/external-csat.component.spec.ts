import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCsatComponent } from './external-csat.component';

describe('ExternalCsatComponent', () => {
  let component: ExternalCsatComponent;
  let fixture: ComponentFixture<ExternalCsatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalCsatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalCsatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
