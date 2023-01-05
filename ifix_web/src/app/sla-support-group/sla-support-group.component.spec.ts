import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaSupportGroupComponent } from './sla-support-group.component';

describe('SlaSupportGroupComponent', () => {
  let component: SlaSupportGroupComponent;
  let fixture: ComponentFixture<SlaSupportGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaSupportGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaSupportGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
