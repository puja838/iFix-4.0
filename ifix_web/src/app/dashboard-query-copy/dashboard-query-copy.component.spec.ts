import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQueryCopyComponent } from './dashboard-query-copy.component';

describe('DashboardQueryCopyComponent', () => {
  let component: DashboardQueryCopyComponent;
  let fixture: ComponentFixture<DashboardQueryCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardQueryCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardQueryCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
