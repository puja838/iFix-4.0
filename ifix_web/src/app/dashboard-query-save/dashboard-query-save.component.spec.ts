import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuerySaveComponent } from './dashboard-query-save.component';

describe('DashboardQuerySaveComponent', () => {
  let component: DashboardQuerySaveComponent;
  let fixture: ComponentFixture<DashboardQuerySaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardQuerySaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardQuerySaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
