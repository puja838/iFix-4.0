import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupUserCopyComponent } from './support-group-user-copy.component';

describe('SupportGroupUserCopyComponent', () => {
  let component: SupportGroupUserCopyComponent;
  let fixture: ComponentFixture<SupportGroupUserCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportGroupUserCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGroupUserCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
