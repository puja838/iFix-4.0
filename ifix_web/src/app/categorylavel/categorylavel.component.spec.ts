import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorylavelComponent } from './categorylavel.component';

describe('CategorylavelComponent', () => {
  let component: CategorylavelComponent;
  let fixture: ComponentFixture<CategorylavelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorylavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorylavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
