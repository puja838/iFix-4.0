import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSlickgridComponent } from './common-slickgrid.component';

describe('CommonSlickgridComponent', () => {
  let component: CommonSlickgridComponent;
  let fixture: ComponentFixture<CommonSlickgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSlickgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSlickgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
