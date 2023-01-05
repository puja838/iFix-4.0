import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsWithAdditionalTabComponent } from './terms-with-additional-tab.component';

describe('TermsWithAdditionalTabComponent', () => {
  let component: TermsWithAdditionalTabComponent;
  let fixture: ComponentFixture<TermsWithAdditionalTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsWithAdditionalTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsWithAdditionalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
