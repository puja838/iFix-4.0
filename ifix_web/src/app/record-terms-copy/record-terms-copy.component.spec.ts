import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTermsCopyComponent } from './record-terms-copy.component';

describe('RecordTermsCopyComponent', () => {
  let component: RecordTermsCopyComponent;
  let fixture: ComponentFixture<RecordTermsCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordTermsCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTermsCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
