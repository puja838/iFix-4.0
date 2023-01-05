import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupNameComponent } from './support-group-name.component';

describe('SupportGroupNameComponent', () => {
  let component: SupportGroupNameComponent;
  let fixture: ComponentFixture<SupportGroupNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportGroupNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGroupNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
