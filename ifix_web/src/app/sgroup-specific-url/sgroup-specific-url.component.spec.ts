import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SgroupSpecificUrlComponent } from './sgroup-specific-url.component';

describe('SgroupSpecificUrlComponent', () => {
  let component: SgroupSpecificUrlComponent;
  let fixture: ComponentFixture<SgroupSpecificUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgroupSpecificUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgroupSpecificUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
