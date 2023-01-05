import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SLATermEntryComponent } from './sla-term-entry.component';

describe('SLATermEntryComponent', () => {
  let component: SLATermEntryComponent;
  let fixture: ComponentFixture<SLATermEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SLATermEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SLATermEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
