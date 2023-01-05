import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TramsDiffComponent } from './trams-diff.component';

describe('TramsDiffComponent', () => {
  let component: TramsDiffComponent;
  let fixture: ComponentFixture<TramsDiffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TramsDiffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TramsDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
