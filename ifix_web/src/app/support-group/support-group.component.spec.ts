import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupComponent } from './support-group.component';

describe('SupportGroupComponent', () => {
  let component: SupportGroupComponent;
  let fixture: ComponentFixture<SupportGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
