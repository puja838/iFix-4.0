import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTermsComponent } from './record-terms.component';

describe('RecordTermsComponent', () => {
  let component: RecordTermsComponent;
  let fixture: ComponentFixture<RecordTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
