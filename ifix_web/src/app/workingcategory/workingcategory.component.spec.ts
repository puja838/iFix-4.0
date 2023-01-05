import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingcategoryComponent } from './workingcategory.component';

describe('WorkingcategoryComponent', () => {
  let component: WorkingcategoryComponent;
  let fixture: ComponentFixture<WorkingcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
