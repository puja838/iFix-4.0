import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCheckingComponent } from './external-checking.component';

describe('ExternalCheckingComponent', () => {
  let component: ExternalCheckingComponent;
  let fixture: ComponentFixture<ExternalCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
